"""
Ingest RAG content from `content/transcripts/` into a Pinecone index, using
Pinecone's model-bound indexes so Pinecone handles embeddings for you.

Usage:
  1) Install deps (once):
       pip install pinecone python-dotenv
  2) Ensure .env.local (or .env) at the project root contains:
       PINECONE_API_KEY=...
       PINECONE_INDEX_NAME=storytelling        # or your index name
       PINECONE_REGION=us-east-1               # matches your Pinecone index region
       RAG_CONTENT_PATH=content/transcripts    # optional, default as shown
       RAG_EMBED_MODEL=llama-text-embed-v2     # optional
  3) From the project root, run:
       python scripts/ingest_rag_content.py
"""

import os
import re
from pathlib import Path
from typing import List, Dict

from dotenv import load_dotenv
from pinecone import Pinecone


def load_env() -> None:
  # Prefer .env.local (Next.js style), then fall back to .env
  root = Path(__file__).resolve().parents[1]
  local_path = root / ".env.local"
  env_path = root / ".env"

  if local_path.exists():
    load_dotenv(local_path)
  if env_path.exists():
    load_dotenv(env_path, override=False)


def find_markdown_files(base_dir: Path) -> List[Path]:
  files: List[Path] = []
  for path in base_dir.rglob("*.md"):
    if path.is_file() and not path.name.startswith("_"):
      files.append(path)
  return files


def split_into_sentences(text: str) -> List[str]:
  """
  Very simple sentence splitter: splits on . ! ? followed by whitespace.
  Keeps the punctuation attached to the sentence.
  """
  text = text.strip()
  if not text:
    return []
  # Split on end-of-sentence punctuation followed by whitespace.
  parts = re.split(r"(?<=[.!?])\s+", text)
  # Re-join any accidental empties and strip
  return [p.strip() for p in parts if p.strip()]


def chunk_text(
  text: str,
  max_chunk_chars: int = 1200,
  overlap_sentences: int = 0,
) -> List[str]:
  """
  Chunk text by **sentence boundaries** instead of raw characters.

  - Splits text into sentences.
  - Builds chunks by adding whole sentences until max_chunk_chars is reached.
  - Optional overlap in **sentences** (e.g. carry last N sentences into next chunk).
  """
  sentences = split_into_sentences(text)
  if not sentences:
    return []

  chunks: List[str] = []
  current_sentences: List[str] = []
  current_len = 0

  for sent in sentences:
    sent_len = len(sent) + (1 if current_sentences else 0)  # account for space/newline
    if current_sentences and current_len + sent_len > max_chunk_chars:
      # close current chunk
      chunks.append(" ".join(current_sentences))
      # start new chunk, optionally with sentence overlap
      if overlap_sentences > 0:
        # take last N sentences from previous chunk as overlap
        overlap = current_sentences[-overlap_sentences:]
        current_sentences = list(overlap)
        current_len = sum(len(s) + 1 for s in current_sentences) - 1
      else:
        current_sentences = []
        current_len = 0

    current_sentences.append(sent)
    current_len += sent_len

  if current_sentences:
    chunks.append(" ".join(current_sentences))

  return chunks


def hard_split(text: str, max_chunk_chars: int, overlap_chars: int) -> List[str]:
  """
  Legacy helper for very long paragraphs. Kept for compatibility but
  no longer used now that chunk_text is sentence-based.
  """
  chunks: List[str] = []
  start = 0
  n = len(text)

  while start < n:
    end = min(start + max_chunk_chars, n)
    # try to end on whitespace within the window to avoid mid-word cuts
    if end < n:
      window_start = max(start, end - max_chunk_chars)
      space_pos = text.rfind(" ", window_start, end)
      if space_pos != -1 and space_pos > start:
        end = space_pos
    chunks.append(text[start:end].strip())
    if end == n:
      break
    start = end - overlap_chars if end - overlap_chars > start else end

  return [c for c in chunks if c]


def build_records_for_file(
  file_path: Path,
  root: Path,
  namespace: str,
) -> List[Dict]:
  rel_path = file_path.relative_to(root)
  base_id = str(rel_path).replace(os.sep, "_")

  raw = file_path.read_text(encoding="utf-8")

  # Split header (metadata) from body: everything up to first blank line is header.
  header_part = ""
  body_part = raw
  if "\n\n" in raw:
    header_part, body_part = raw.split("\n\n", 1)

  # Extract author from header lines, e.g. "**Author/Speaker:** Name"
  author = None
  for line in header_part.splitlines():
    if "Author/Speaker:" in line:
      # Remove markdown bold and label
      cleaned = re.sub(r"\*\*Author/Speaker:\*\*\s*", "", line).strip()
      author = cleaned.strip("* ").strip()
      break

  # Chunk only the body, not the header metadata
  chunks = chunk_text(body_part)

  records: List[Dict] = []
  for i, chunk in enumerate(chunks):
    record_id = f"{base_id}-chunk-{i}"
    records.append(
      {
        "_id": record_id,
        "text": chunk,
        "source": str(rel_path),
        "chunk_index": i,
        "author": author,
      }
    )

  return records


def main() -> None:
  load_env()

  api_key = os.getenv("PINECONE_API_KEY")
  index_name = os.getenv("PINECONE_INDEX_NAME", "storytelling")
  region = os.getenv("PINECONE_REGION", "us-east-1")
  content_path = os.getenv("RAG_CONTENT_PATH", "content/transcripts")
  embed_model = os.getenv("RAG_EMBED_MODEL", "llama-text-embed-v2")
  namespace = os.getenv("PINECONE_NAMESPACE", "stories")

  if not api_key:
    raise RuntimeError("PINECONE_API_KEY is not set in .env.local or .env")

  root = Path(__file__).resolve().parents[1]
  content_dir = (root / content_path).resolve()

  print(f"PINECONE_INDEX_NAME: {index_name}")
  print(f"PINECONE_REGION: {region}")
  print(f"Content directory: {content_dir}")
  print(f"Embed model: {embed_model}")

  if not content_dir.exists():
    raise RuntimeError(f"Content directory does not exist: {content_dir}")

  pc = Pinecone(api_key=api_key)

  # Ensure index exists and is bound to the model so Pinecone handles embedding.
  if not pc.has_index(index_name):
    print(f"Creating index '{index_name}' for model '{embed_model}' in region '{region}'...")
    pc.create_index_for_model(
      name=index_name,
      cloud="aws",
      region=region,
      embed={
        "model": embed_model,
      },
    )
    print(f"✅ Created index: {index_name}")
  else:
    print(f"✅ Index already exists: {index_name}")

  index = pc.Index(index_name)

  # Optional: clear existing records in this namespace before ingesting.
  clear_flag = os.getenv("PINECONE_CLEAR_NAMESPACE", "false").lower()
  if clear_flag in ("1", "true", "yes"):
    print(f"🧹 Clearing all records in namespace '{namespace}' before ingest...")
    index.delete(namespace=namespace, delete_all=True)

  md_files = find_markdown_files(content_dir)
  if not md_files:
    print("No Markdown files found to ingest.")
    return

  print(f"Found {len(md_files)} Markdown file(s) to ingest:")
  for f in md_files:
    print(f"  - {f.relative_to(root)}")

  total_records = 0
  batch_size = 100

  for file_path in md_files:
    records = build_records_for_file(file_path, root, namespace)
    if not records:
      continue

    print(f"\n📄 {file_path.relative_to(root)}: {len(records)} chunk(s)")

    # Upsert in batches
    for i in range(0, len(records), batch_size):
      batch = records[i : i + batch_size]
      index.upsert_records(namespace=namespace, records=batch)
      print(f"   ✅ Upserted {len(batch)} record(s) [{i}–{i + len(batch) - 1}]")

    total_records += len(records)

  print(f"\n🎉 Ingestion complete. Total records upserted: {total_records}")
  stats = index.describe_index_stats()
  print("Index stats:")
  print(stats)


if __name__ == "__main__":
  main()

