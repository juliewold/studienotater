import { useEffect, useState } from "react";
import { watchPrivateStorageUrl, type StorageUrlState, type StudyBucket } from "../services/media/privateStorage";

export function usePrivateStorageUrl(bucket: StudyBucket, path: string | null | undefined): StorageUrlState {
  const key = `${bucket}:${path ?? ""}`;
  const [state, setState] = useState<StorageUrlState & { key: string }>({ key: "", url: null, loading: !!path, error: null });
  useEffect(() => {
    if (!path) return;
    return watchPrivateStorageUrl(bucket, path, next => setState({ ...next, key }));
  }, [bucket, path, key]);
  return state.key === key && path ? state : { url: null, loading: !!path, error: null };
}
