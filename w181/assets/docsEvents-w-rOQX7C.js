/*!
 * TreDeSpace Web Viewer v0.0.53
 * Copyright (c) 2026 Vegar Ringdal. All rights reserved.
 *
 * Use of the hosted application is permitted as-is. Redistribution of this
 * code or a reconstructed form of it, publication of the model format or
 * derived tools to compete with the application, and use of this code or its
 * data for machine-learning training or text and data mining are not
 * permitted. Rights under mandatory law (incl. decompilation for
 * interoperability) are unaffected. See https://tredespace.com — LICENSE.
 */
import"./modulepreload-polyfill-Dezn_h7o.js";import"./theme-D8s3F96L.js";var e=`// tredespace-client.ts — typed postMessage client for the TreDeSpace viewer.
//
// COPY THIS FILE into your host application (it is dependency-free and
// self-contained). It implements the protocol described in EVENTS.md of the
// viewer repository, protocol version 1. Keep the two in sync when updating.
//
// STRICT (enforced by the build): every command method needs a JSDoc comment
// AND a matching \`### command\` section with a fenced payload/response example in
// EVENTS.md — the /docs/ reference is generated from both. \`vite build\` fails if
// either is missing. See CLAUDE.md → "postMessage API".
//
// Commands NEVER throw — they resolve a Result<T> = { data?, error? }; check
// \`error\` (Rust-style). Only ready()/on*()/dispose() sit outside that.
//
// Usage:
//   const client = new TredespaceClient(iframe, { targetOrigin: 'https://viewer.example.com' });
//   await client.ready();
//   const res = await client.selectionSet(['/TP400-PIPE-01']);
//   if (res.error) console.warn(res.error.msg);
//   else console.log(res.data.matched, res.data.missed);
//   client.dispose();

// ── protocol types ───────────────────────────────────────────────────────────

export const TREDESPACE_PROTOCOL = 1;

/** Failure codes: the five protocol codes the viewer can return, plus two
 *  host-side ones — a request that timed out, or a dead transport (disposed
 *  client / no viewer window). */
export type TredespaceErrorCode =
  | 'bad-payload'
  | 'not-ready'
  | 'busy'
  | 'not-found'
  | 'internal'
  | 'timeout'
  | 'transport';

/** Failure detail on a {@link Result}. \`msg\` is a human-readable string safe to
 *  show a user; \`err\` is the underlying detail when there is one (the raw wire
 *  error, or a caught exception). */
export interface TredespaceError {
  code: TredespaceErrorCode;
  msg: string;
  err?: unknown;
}

/** Rust-style result — exactly one of \`data\` / \`error\` is present. Command
 *  methods resolve this and NEVER throw; check \`error\` (or \`data\`).
 *
 *  \`\`\`ts
 *  const res = await client.selectionSet(['/SITE/PIPE-01']);
 *  if (res.error) console.warn(res.error.msg);
 *  else console.log(res.data.matched);
 *  \`\`\` */
export interface Result<T> {
  data?: T;
  error?: TredespaceError;
}

export interface AppReady {
  version: string;
  api: number;
}

export interface SelectionSetResult {
  matched: number;
  missed: string[];
}

export interface SelectionGetResult {
  count: number;
  /** selection roots as fullnames */
  fullnames: string[];
}

export interface LabelInput {
  /** shown text — supports **bold** and newlines in rich mode */
  text: string;
  /** anchor to a model item by fullname (bounds centre)… */
  fullname?: string;
  /** …or at an explicit world-space point */
  anchor?: [number, number, number];
}

export interface LabelsResult {
  added: number;
  /** fullnames that resolved to nothing */
  missed: string[];
}

export interface MeasurePointInput {
  pos: [number, number, number];
}

export interface MeasurementInput {
  kind: 'point' | 'line' | 'path' | 'area' | 'diameter' | 'angle';
  points: MeasurePointInput[];
  label?: string;
}

export interface FilterRowInput {
  op: 'append' | 'remove';
  /** contains | single (equals, * at start/end) | starts | ends |
   *  wildcard (equals, * anywhere) | multi (one name per line) */
  mode: 'contains' | 'single' | 'multi' | 'starts' | 'ends' | 'wildcard';
  value: string;
  comment?: string;
  /** Hierarchy level (1-9) the filter is applied TO, counted like the tree
   *  panel (import folders included): the row matches only the names at that
   *  level and each match includes its whole subtree. Level 1 tests the
   *  import-folder name (a hit takes everything under the folder).
   *  0/omitted = match at any level. */
  level?: number;
}

export interface ColorRuleInput {
  comment?: string;
  enabled?: boolean;
  filters: FilterRowInput[];
  /** hex color, or null = restore default */
  color: string | null;
  /** 0-1, 1 = default */
  opacity?: number;
}

/** A clip shape to append (sphere / cylinder / box). Only \`kind\` is required;
 *  the rest default (center [0,0,0], radius 5, height 10, box halfExtents
 *  [1,1,1], identity rotation, enabled, not inverted). */
export interface ClipShapeInput {
  kind: 'sphere' | 'cylinder' | 'box';
  label?: string;
  center?: [number, number, number];
  axis?: [number, number, number];
  radius?: number;
  height?: number;
  halfExtents?: [number, number, number];
  rotation?: [number, number, number, number];
  enabled?: boolean;
  /** clip INSIDE the shape (a hole) instead of outside */
  inverted?: boolean;
  showHelper?: boolean;
}

export interface ColorRulesResult {
  rules: number;
  ran: boolean;
  matches: number[];
}

export interface SettingsGetResult {
  version: string;
  /** the persisted viewer-settings snapshot (read-only) */
  viewer: Record<string, unknown>;
}

export interface AssetInfo {
  id: string;
  /** the store this asset belongs to (default 'main') */
  store: string;
  name: string;
  folder: string;
  fileName: string;
  /** MD5 of the source bytes — compare to decide whether to re-import */
  md5?: string;
  size: number;
  kind?: 'merged' | 'standard';
  hasNormals?: boolean;
  edges?: boolean;
  loaded: boolean;
}

/** A store = a named group of assets (a project). 'main' always exists. */
export interface StoreInfo {
  name: string;
  description: string;
  count: number;
}

export type ImportFormat = 'glb-merged' | 'glb-standard' | 'rvm' | 'ifc' | 'step';

export interface AssetsImportResult {
  entries: AssetInfo[];
  /** how many prior assets were removed by \`replace\` (0 unless replace was set) */
  replaced: number;
}

/** One file for {@link TredespaceClient.assetsImportUrl}: a URL the VIEWER
 *  downloads itself, plus the pipeline to cook it with. \`format\` is required
 *  (a \`.glb\` URL is ambiguous — merged vs standard — so no format is inferred
 *  on the wire; infer it host-side from the extension if you like). */
export interface ImportUrlFile {
  /** URL the viewer fetches (subject to the VIEWER origin's CORS, not yours). */
  url: string;
  format: ImportFormat;
  /** name to store the asset under; defaults to the URL's last path segment. */
  fileName?: string;
  folder?: string;
  /** per-format options, e.g. \`{ normals: true, edges: true }\` for glb-standard. */
  options?: Record<string, unknown>;
}

/** Per-file outcome within an {@link AssetsImportUrlResult}. Exactly one batch
 *  entry per input file, in input order; a failure here never aborts the rest. */
export interface AssetsImportUrlEntry {
  url: string;
  ok: boolean;
  /** assets produced (present when \`ok\`). */
  entries?: AssetInfo[];
  /** prior assets removed by \`replace\` for this file (present when \`ok\`). */
  replaced?: number;
  /** why this file failed (present when not \`ok\`) — download or convert error. */
  error?: string;
}

export interface AssetsImportUrlResult {
  /** number of files that imported successfully. */
  imported: number;
  /** number of files that failed (download or convert). */
  failed: number;
  results: AssetsImportUrlEntry[];
}

/** Progress tick for {@link TredespaceClient.assetsImportUrl} — one per phase
 *  change. \`completed\`/\`total\` count whole files; \`phase\` is what just started
 *  (\`download\`/\`convert\`) or ended (\`done\`/\`error\`) for \`url\`. */
export interface ImportUrlProgress {
  completed: number;
  total: number;
  url: string;
  phase: 'download' | 'convert' | 'done' | 'error';
}

/** One SQLite database in OPFS (\`sql_assets/<store>/<file>\`). Stores are shared
 *  with model assets. \`path\` is what you pass as \`mainDb\` to \`sqlQuery\`, and
 *  what an ATTACH string literal references. */
export interface SqlDbInfo {
  store: string;
  fileName: string;
  path: string;
  size: number;
  modified: number;
}

export interface SqlImportResult {
  /** OPFS paths of the databases written. */
  imported: string[];
  /** file names skipped — already existed without \`replace\`, or the file was locked. */
  skipped: string[];
  /** how many existing databases were overwritten. */
  replaced: number;
}

export interface SqlStatementResult {
  /** column names, or null for a statement that returned no result set. */
  columns: string[] | null;
  /** result rows as compact value arrays (parallel to \`columns\`). */
  rows: unknown[];
  /** total rows the statement produced, before any \`maxRows\` truncation. */
  rowCount: number;
  /** present + true when \`rows\` was cut to \`maxRows\`. */
  truncated?: boolean;
}

export interface SqlQueryResult {
  /** one entry per statement in the script, in order. */
  statements: SqlStatementResult[];
  /** wall-clock milliseconds for the run. */
  ms: number;
}

/** One ancestor of a clicked tree row. \`folder\` entries are import folders
 *  (with their cumulative path); \`node\` entries are model hierarchy levels. */
export interface TreeSelectParent {
  name: string;
  type: 'folder' | 'node';
  /** cumulative folder path — folder parents only */
  path?: string;
}

/** Unsolicited \`tree.select\` event: the user clicked a row in the tree view. */
export interface TreeSelectEvent {
  /** fullname of the clicked node (folder path for folder rows) */
  fullname: string;
  name: string;
  /** true for import folders and hierarchy nodes with children */
  folder: boolean;
  /** the import folder the model lives in (item rows only) */
  group?: string;
  /** every parent up to the root, outermost first */
  parents: TreeSelectParent[];
}

// ── client ───────────────────────────────────────────────────────────────────

export interface TredespaceClientOptions {
  /** The viewer's origin, e.g. 'https://viewer.example.com'. Required. */
  targetOrigin: string;
  /** Per-command timeout (ms). Imports use importTimeoutMs. Default 30 000. */
  timeoutMs?: number;
  /** Timeout for assets.import (conversions can be long). Default 600 000. */
  importTimeoutMs?: number;
}

interface Pending {
  settle: (r: Result<unknown>) => void;
  timer: ReturnType<typeof setTimeout>;
}

/** Blob/File payloads at or above this size are streamed in chunks rather than
 *  sent as one message, so a multi-GB import never allocates one huge buffer. */
const CHUNKED_UPLOAD_THRESHOLD = 500 * 1024 * 1024;
/** Per-chunk transfer size for large uploads. */
const UPLOAD_CHUNK_SIZE = 64 * 1024 * 1024;

export class TredespaceClient {
  private target: Window | null;
  private readonly origin: string;
  private readonly timeoutMs: number;
  private readonly importTimeoutMs: number;
  private readonly pending = new Map<string, Pending>();
  private readonly eventHandlers = new Map<string, Set<(payload: unknown) => void>>();
  // random per-instance prefix: several clients sharing one transport (e.g. a
  // future BroadcastChannel) can never collide on correlation ids
  private readonly idPrefix = \`ts-\${Math.random().toString(36).slice(2, 10)}\`;
  private nextId = 1;
  private readyPayload: AppReady | null = null;
  private readyWaiters: ((r: AppReady) => void)[] = [];
  private readonly onMessage = (e: MessageEvent) => this.handle(e);

  constructor(target: Window | HTMLIFrameElement, opts: TredespaceClientOptions) {
    this.target = target instanceof HTMLIFrameElement ? target.contentWindow : target;
    this.origin = opts.targetOrigin;
    this.timeoutMs = opts.timeoutMs ?? 30_000;
    this.importTimeoutMs = opts.importTimeoutMs ?? 600_000;
    window.addEventListener('message', this.onMessage);
  }

  /** Resolves once the viewer has announced app.ready (queues until then). */
  ready(): Promise<AppReady> {
    if (this.readyPayload) {
      return Promise.resolve(this.readyPayload);
    }
    return new Promise((resolve) => this.readyWaiters.push(resolve));
  }

  /** Detach the message listener and settle every in-flight request with a
   *  \`transport\` error. Call when the host tears down the iframe. */
  dispose() {
    window.removeEventListener('message', this.onMessage);
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.settle({ error: { code: 'transport', msg: 'client disposed' } });
    }
    this.pending.clear();
    this.target = null;
  }

  // ── commands (one method per EVENTS.md entry) ─────────────────────────────

  /** Replace the selection by fullname (reveals the first hit in the tree).
   *  \`missed\` lists fullnames that resolved to nothing. */
  selectionSet(fullnames: string[]): Promise<Result<SelectionSetResult>> {
    return this.send('selection.set', { fullnames });
  }
  /** Clear the current selection. */
  selectionClear(): Promise<Result<Record<string, never>>> {
    return this.send('selection.clear', {});
  }
  /** Read the current selection roots as fullnames. */
  selectionGet(): Promise<Result<SelectionGetResult>> {
    return this.send('selection.get', {});
  }

  /** Replace all scene labels. Each label anchors either to a world-space
   *  \`anchor\` point or to a \`fullname\` (the item's bounds centre); \`missed\`
   *  lists fullnames that resolved to nothing. */
  labelsSet(labels: LabelInput[]): Promise<Result<LabelsResult>> {
    return this.send('labels.set', { labels });
  }
  /** Append scene labels (same anchor forms as {@link labelsSet}). */
  labelsAdd(labels: LabelInput[]): Promise<Result<LabelsResult>> {
    return this.send('labels.add', { labels });
  }
  /** Remove every scene label. */
  labelsClear(): Promise<Result<Record<string, never>>> {
    return this.send('labels.clear', {});
  }
  /** Spread overlapping labels apart from their anchors (the in-app explode). */
  labelsExplode(): Promise<Result<Record<string, never>>> {
    return this.send('labels.explode', {});
  }
  /** Pull exploded labels back onto their anchor points. */
  labelsImplode(): Promise<Result<Record<string, never>>> {
    return this.send('labels.implode', {});
  }

  /** Replace all measurements (world-space points; same shape as the
   *  measurements JSON export). */
  measurementsSet(measurements: MeasurementInput[]): Promise<Result<{ added: number }>> {
    return this.send('measurements.set', { measurements });
  }
  /** Append measurements (same shape as {@link measurementsSet}). */
  measurementsAdd(measurements: MeasurementInput[]): Promise<Result<{ added: number }>> {
    return this.send('measurements.add', { measurements });
  }
  /** Remove every measurement. */
  measurementsClear(): Promise<Result<Record<string, never>>> {
    return this.send('measurements.clear', {});
  }

  /** Replace the Set-Color rules. \`mode:'append'\` keeps existing rules
   *  (default 'reset' replaces); \`mode:'hide'\` runs hide-model style — hide
   *  everything, the rules unhide and colour their matches; \`run:true\`
   *  applies them immediately. */
  colorRulesSet(
    rules: ColorRuleInput[],
    opts?: { mode?: 'reset' | 'append' | 'hide'; run?: boolean },
  ): Promise<Result<ColorRulesResult>> {
    return this.send('colorRules.set', { rules, mode: opts?.mode ?? 'reset', run: opts?.run ?? false });
  }
  /** Append Set-Color rules; \`run:true\` applies them immediately. */
  colorRulesAdd(rules: ColorRuleInput[], opts?: { run?: boolean }): Promise<Result<ColorRulesResult>> {
    return this.send('colorRules.add', { rules, run: opts?.run ?? false });
  }
  /** Re-run the current rules against the model; returns matched item counts. */
  colorRulesRun(): Promise<Result<{ matches: number[] }>> {
    return this.send('colorRules.run', {});
  }
  /** Remove all Set-Color rules. Does NOT restore already-painted colors — use
   *  {@link colorRulesResetModel} for that. */
  colorRulesClear(): Promise<Result<Record<string, never>>> {
    return this.send('colorRules.clear', {});
  }
  /** Reset the model's color/opacity overrides (the in-app Alt+R action). */
  colorRulesResetModel(): Promise<Result<Record<string, never>>> {
    return this.send('colorRules.resetModel', {});
  }

  // ── clipping box + shapes ─────────────────────────────────────────────────
  /** Fit the clip box to the current selection. \`offset\` adds a margin on every
   *  side for THIS call only (it doesn't change the panel's stored offset). */
  clipBoxFitSelected(offset?: number): Promise<Result<{ offset: number }>> {
    return this.send('clip.box.fitSelected', offset === undefined ? {} : { offset });
  }
  /** Append clip shapes (sphere/cylinder/box). Returns how many were added. */
  clipShapesAdd(shapes: ClipShapeInput[]): Promise<Result<{ added: number }>> {
    return this.send('clip.shapes.add', { shapes });
  }
  /** Turn box clipping off (leaves any clip shapes in place). */
  clipBoxDisable(): Promise<Result<Record<string, never>>> {
    return this.send('clip.box.disable', {});
  }
  /** Full clip reset — disable the box AND remove every clip shape. */
  clipReset(): Promise<Result<Record<string, never>>> {
    return this.send('clip.reset', {});
  }

  // ── navigation ────────────────────────────────────────────────────────────
  /** Fly the camera to a node by fullname. \`select\` also selects it (default
   *  just flies). \`matched\` is false when the fullname isn't found. */
  navFlyTo(fullname: string, opts?: { select?: boolean }): Promise<Result<{ matched: boolean }>> {
    return this.send('nav.flyTo', { fullname, select: opts?.select ?? false });
  }
  /** Set the orbit pivot to a node by fullname (camera stays); \`select\` also
   *  selects it. \`matched\` is false when the fullname isn't found. */
  navOrbit(fullname: string, opts?: { select?: boolean }): Promise<Result<{ matched: boolean }>> {
    return this.send('nav.orbit', { fullname, select: opts?.select ?? false });
  }

  /** Read-only snapshot of the persisted viewer settings, plus the app version. */
  settingsGet(): Promise<Result<SettingsGetResult>> {
    return this.send('settings.get', {});
  }

  /** Toggle sketch mode (white background + edge lines), or set it explicitly
   *  by passing \`on\`. Returns the resulting state. */
  viewSketch(on?: boolean): Promise<Result<{ sketch: boolean }>> {
    return this.send('view.sketch', on === undefined ? {} : { on });
  }

  /** Capture the current viewport as a PNG — the converged frame (edges, AA,
   *  AO, view cube) plus the label and measurement overlays, exactly as shown.
   *  Returns a \`data:image/png;base64,…\` URL (drop it straight into an \`<img>\`
   *  src or a download link) and the pixel size. */
  viewScreenshot(): Promise<Result<{ dataUrl: string; width: number; height: number }>> {
    return this.send('view.screenshot', {});
  }

  /** List the stores (projects). Fetch this first to know valid \`store\` names
   *  for assetsList / assetsLoad / assetsImport. */
  storesList(): Promise<Result<{ stores: StoreInfo[] }>> {
    return this.send('stores.list', {});
  }

  /** Create a store (project) with an optional description. Idempotent — an
   *  existing name (or 'main') resolves with \`created:false\` and the current
   *  store, so it is safe to call before targeting a store you're not sure
   *  exists. The name is sanitised (slashes → '-', trimmed, capped at 60). */
  storesCreate(name: string, opts?: { description?: string }): Promise<Result<{ created: boolean; store: StoreInfo }>> {
    return this.send('stores.create', { name, description: opts?.description ?? '' });
  }

  /** List assets. Pass \`store\` to list just that store (must be a known name). */
  assetsList(store?: string): Promise<Result<{ assets: AssetInfo[] }>> {
    return this.send('assets.list', store === undefined ? {} : { store });
  }

  /** Send a file for conversion into the asset manager.
   *
   *  \`bytes\` may be an ArrayBuffer (TRANSFERRED - unusable in the host after) or
   *  a Blob/File (passed by reference, not detached). A Blob/File at or above
   *  500 MB is automatically streamed in 64 MB chunks (many small postMessages,
   *  reassembled in the viewer) so multi-GB files import without ever allocating
   *  one huge buffer. Everything is plain postMessage - cross-origin safe.
   *
   *  Import does NOT render - call \`assetsLoad\` afterwards, or use
   *  \`assetsImportAndLoad\`. \`onProgress\` (0..1) fires per chunk for large files. */
  assetsImport(input: {
    fileName: string;
    format: ImportFormat;
    bytes: ArrayBuffer | Blob;
    folder?: string;
    /** destination store (default 'main'); must be a known store name */
    store?: string;
    /** delete any prior asset sharing this one's store + folder + name */
    replace?: boolean;
    /** per-format options, e.g. { normals: true, edges: true } for glb-standard */
    options?: Record<string, unknown>;
    /** upload progress (0..1); only fires for chunk-streamed large files */
    onProgress?: (fraction: number) => void;
  }): Promise<Result<AssetsImportResult>> {
    const { bytes, onProgress, ...payload } = input;
    const size = bytes instanceof Blob ? bytes.size : bytes.byteLength;
    if (bytes instanceof Blob && size >= CHUNKED_UPLOAD_THRESHOLD) {
      return this.chunkedImport(bytes, payload, onProgress);
    }
    // Small Blob/File: read it HERE (the host) and transfer the ArrayBuffer.
    // The viewer must not read a picked File across postMessage - the file
    // reference doesn't survive the boundary and throws NotReadableError.
    if (bytes instanceof Blob) {
      return bytes
        .arrayBuffer()
        .then((buf) =>
          this.send<AssetsImportResult>('assets.import', payload, { bytes: buf, timeoutMs: this.importTimeoutMs }),
        );
    }
    return this.send<AssetsImportResult>('assets.import', payload, { bytes, timeoutMs: this.importTimeoutMs });
  }

  /** Import then immediately load the produced assets - the "import a sample and
   *  show it" flow. Returns the import result plus how many were loaded. */
  async assetsImportAndLoad(
    input: Parameters<TredespaceClient['assetsImport']>[0] & { fit?: boolean },
  ): Promise<Result<AssetsImportResult & { loaded: number }>> {
    const { fit, ...imp } = input;
    const res = await this.assetsImport(imp);
    if (res.error) {
      return { error: res.error };
    }
    const data = res.data as AssetsImportResult;
    const ids = data.entries.map((e) => e.id);
    let loaded = 0;
    if (ids.length) {
      const lr = await this.assetsLoad(ids, { fit: fit ?? true, ...(input.store ? { store: input.store } : {}) });
      if (lr.error) {
        return { error: lr.error };
      }
      loaded = (lr.data as { loaded: number }).loaded;
    }
    return { data: { ...data, loaded } };
  }

  /** Batch-import files the VIEWER downloads by URL — no bytes cross
   *  postMessage. Each file names its own \`format\` (required — a \`.glb\` URL is
   *  ambiguous). The viewer fetches up to \`concurrent\` files at once but cooks
   *  them ONE at a time (the importer is single-locked), so \`concurrent\` is
   *  really download parallelism — keep it modest for large RVM/IFC/STEP.
   *
   *  One \`results\` entry per input file, in order; a download or convert
   *  failure is recorded there and never aborts the batch. \`onProgress\` fires
   *  per phase change while the batch runs. URLs are fetched under the VIEWER
   *  origin's CORS, not the host's. */
  assetsImportUrl(
    files: ImportUrlFile[],
    opts?: {
      /** how many downloads run at once (default 3, clamped 1..8 by the viewer). */
      concurrent?: number;
      /** destination store (default 'main'); must be a known store name. */
      store?: string;
      /** delete any prior asset sharing each new one's store + folder + name. */
      replace?: boolean;
      onProgress?: (p: ImportUrlProgress) => void;
    },
  ): Promise<Result<AssetsImportUrlResult>> {
    const batchId = \`\${this.idPrefix}-batch-\${this.nextId++}\`;
    const off = opts?.onProgress
      ? this.on('assets.importUrl:progress', (p) => {
          const pr = p as ImportUrlProgress & { batchId?: string };
          if (pr.batchId === batchId) {
            opts.onProgress?.(pr);
          }
        })
      : undefined;
    // one file can be a long cook; give the whole batch room beyond one import.
    const timeoutMs = this.importTimeoutMs * Math.max(1, files.length);
    return this.send<AssetsImportUrlResult>(
      'assets.importUrl',
      {
        files,
        batchId,
        ...(opts?.concurrent !== undefined ? { concurrent: opts.concurrent } : {}),
        ...(opts?.store ? { store: opts.store } : {}),
        ...(opts?.replace ? { replace: opts.replace } : {}),
      },
      { timeoutMs },
    ).finally(() => off?.());
  }

  /** Stream a large Blob/File to the viewer in chunks, then import it. Used
   *  automatically by \`assetsImport\` for payloads >= the threshold. */
  private async chunkedImport(
    blob: Blob,
    payload: {
      fileName: string;
      format: ImportFormat;
      folder?: string;
      store?: string;
      replace?: boolean;
      options?: Record<string, unknown>;
    },
    onProgress?: (fraction: number) => void,
  ): Promise<Result<AssetsImportResult>> {
    const begin = await this.send<{ uploadId: string }>(
      'assets.uploadBegin',
      { fileName: payload.fileName, size: blob.size },
      { timeoutMs: this.importTimeoutMs },
    );
    if (begin.error) {
      return { error: begin.error };
    }
    const { uploadId } = begin.data as { uploadId: string };
    const total = blob.size;
    for (let offset = 0; offset < total; offset += UPLOAD_CHUNK_SIZE) {
      const end = Math.min(offset + UPLOAD_CHUNK_SIZE, total);
      // only one chunk is in memory at a time; its ArrayBuffer is transferred
      const buf = await blob.slice(offset, end).arrayBuffer();
      const chunk = await this.send(
        'assets.uploadChunk',
        { uploadId, offset },
        { bytes: buf, timeoutMs: this.importTimeoutMs },
      );
      if (chunk.error) {
        await this.send('assets.uploadAbort', { uploadId }); // best-effort cleanup
        return { error: chunk.error };
      }
      onProgress?.(end / total);
    }
    return this.send<AssetsImportResult>(
      'assets.uploadFinish',
      { uploadId, ...payload },
      { timeoutMs: this.importTimeoutMs },
    );
  }

  /** Render imported assets into the viewer. \`fit:true\` (default) frames them.
   *  Pair with {@link assetsImport}, or use {@link assetsImportAndLoad}. */
  assetsLoad(ids: string[], opts?: { fit?: boolean; store?: string }): Promise<Result<{ loaded: number }>> {
    return this.send('assets.load', { ids, fit: opts?.fit ?? true, ...(opts?.store ? { store: opts.store } : {}) });
  }
  /** Remove assets from the viewport (they stay in the asset manager). */
  assetsUnload(ids: string[]): Promise<Result<{ unloaded: number }>> {
    return this.send('assets.unload', { ids });
  }

  /** Delete persisted assets from local storage (OPFS). A copy already loaded
   *  into the viewer stays on screen - import -> load -> remove leaves a
   *  session-only model with nothing on disk. */
  assetsRemove(ids: string[], opts?: { store?: string }): Promise<Result<{ removed: number }>> {
    return this.send('assets.remove', { ids, ...(opts?.store ? { store: opts.store } : {}) });
  }

  // ── SQL databases (SQLite in OPFS, stores shared with model assets) ───────
  /** List SQLite databases. Pass \`store\` to list just that store (a known
   *  name). Each db's \`path\` is what you pass as \`mainDb\` to \`sqlQuery\`. */
  sqlList(store?: string): Promise<Result<{ dbs: SqlDbInfo[] }>> {
    return this.send('sql.list', store === undefined ? {} : { store });
  }

  /** Import a .db/.sqlite file into a store (default 'main'). \`bytes\` is an
   *  ArrayBuffer (TRANSFERRED — unusable after) or a Blob/File (by reference).
   *  \`replace: true\` overwrites an existing same-name db; false (default) skips
   *  it. WAL databases are normalised to rollback journalling on the way in
   *  (the OPFS VFS is shm-less, so WAL can't be read shared). */
  sqlImport(input: {
    fileName: string;
    bytes: ArrayBuffer | Blob;
    /** destination store (default 'main'); must be a known store name */
    store?: string;
    replace?: boolean;
  }): Promise<Result<SqlImportResult>> {
    const { bytes, ...payload } = input;
    // A picked File must be read HERE and transferred — a File reference does
    // not survive postMessage into the viewer (NotReadableError otherwise).
    if (bytes instanceof Blob) {
      return bytes
        .arrayBuffer()
        .then((buf) =>
          this.send<SqlImportResult>('sql.import', payload, { bytes: buf, timeoutMs: this.importTimeoutMs }),
        );
    }
    return this.send<SqlImportResult>('sql.import', payload, { bytes, timeoutMs: this.importTimeoutMs });
  }

  /** Delete databases by their OPFS \`path\` (from \`sqlList\`). A path in use by a
   *  running query (or another tab) is skipped, not waited on. */
  sqlDelete(paths: string[]): Promise<Result<{ deleted: string[]; skipped: string[] }>> {
    return this.send('sql.delete', { paths });
  }

  /** Run SQL against \`mainDb\` (a path from \`sqlList\`). ATTACH other databases
   *  inline with their OPFS path and they are locked automatically. \`lockmode\`
   *  defaults to 'shared' (read-only, several readers at once); pass
   *  'exclusive' to write. Rows per statement are capped at \`maxRows\` (default
   *  10000; a cut statement carries \`truncated: true\`). Results come back one
   *  entry per statement, in order. */
  sqlQuery(input: {
    sql: string;
    mainDb: string;
    lockmode?: 'shared' | 'exclusive';
    maxRows?: number;
  }): Promise<Result<SqlQueryResult>> {
    return this.send('sql.query', { ...input }, { timeoutMs: this.importTimeoutMs });
  }

  /** Toggle kiosk mode (viewport only — panels hidden). Omit \`on\` to query
   *  the current state without changing it. */
  uiKiosk(on?: boolean): Promise<Result<{ kiosk: boolean }>> {
    return this.send('ui.kiosk', on === undefined ? {} : { on });
  }

  /** Set the viewer's colour theme, or omit \`theme\` to query the current one
   *  without changing it. Handy for keeping an embedded viewer in step with the
   *  host page's light/dark mode. */
  uiTheme(theme?: 'dark' | 'light'): Promise<Result<{ theme: 'dark' | 'light' }>> {
    return this.send('ui.theme', theme === undefined ? {} : { theme });
  }

  /** Ask the viewer to close the dialog/panel hosting THIS window (embedded
   *  external apps closing themselves, e.g. a project selector after pick). */
  uiClose(): Promise<Result<{ closed: boolean }>> {
    return this.send('ui.close', {});
  }

  /** Open / close a dock panel by id (e.g. 'hierarchy'). */
  uiShowPanel(panel: string): Promise<Result<{ shown: boolean }>> {
    return this.send('ui.showPanel', { panel });
  }
  /** Hide a dock panel by id (counterpart of {@link uiShowPanel}). */
  uiHidePanel(panel: string): Promise<Result<{ hidden: boolean }>> {
    return this.send('ui.hidePanel', { panel });
  }

  /** Show / hide the blocking loading overlay. \`header\` is the bold title line,
   *  \`title\` the message below it. */
  uiLoadingShow(opts?: { header?: string; title?: string }): Promise<Result<Record<string, never>>> {
    return this.send('ui.loading.show', { ...opts });
  }
  /** Hide the blocking loading overlay shown by {@link uiLoadingShow}. */
  uiLoadingHide(): Promise<Result<Record<string, never>>> {
    return this.send('ui.loading.hide', {});
  }

  /** Show a confirm dialog; resolves with the user's choice. */
  uiConfirm(opts: {
    question: string;
    header?: string;
    yes?: string;
    no?: string;
  }): Promise<Result<{ confirmed: boolean }>> {
    return this.send('ui.confirm', { ...opts });
  }

  /** Show an error dialog. \`title\` is the message, \`header\` the bold title. */
  uiError(opts: { title: string; header?: string }): Promise<Result<Record<string, never>>> {
    return this.send('ui.error', { ...opts });
  }

  /** Replace (default) or merge the viewer's shared instance data — one JSON
   *  object per viewer window, for cross-dialog coordination. Every host gets
   *  an \`instance.changed\` event afterwards. */
  instanceSet(
    data: Record<string, unknown>,
    opts?: { merge?: boolean },
  ): Promise<Result<{ data: Record<string, unknown> }>> {
    return this.send('instance.set', { data, merge: opts?.merge ?? false });
  }

  /** Read the viewer's shared instance data (see {@link instanceSet}). */
  instanceGet(): Promise<Result<{ data: Record<string, unknown> }>> {
    return this.send('instance.get', {});
  }

  // ── unsolicited app → host events ─────────────────────────────────────────

  /** Listen for an app event (\`id: null\` messages, e.g. 'tree.select').
   *  Returns an unsubscribe function. */
  on(type: string, handler: (payload: unknown) => void): () => void {
    let set = this.eventHandlers.get(type);
    if (!set) {
      set = new Set();
      this.eventHandlers.set(type, set);
    }
    set.add(handler);
    return () => void set.delete(handler);
  }

  /** Typed convenience for the tree-click event. */
  onTreeSelect(handler: (e: TreeSelectEvent) => void): () => void {
    return this.on('tree.select', (p) => handler(p as TreeSelectEvent));
  }

  /** Typed convenience for instance-data changes (any dialog called instance.set). */
  onInstanceChanged(handler: (e: { data: Record<string, unknown> }) => void): () => void {
    return this.on('instance.changed', (p) => handler(p as { data: Record<string, unknown> }));
  }

  // ── plumbing ──────────────────────────────────────────────────────────────

  private send<T>(
    type: string,
    payload: Record<string, unknown>,
    extra?: { bytes?: ArrayBuffer | Blob; timeoutMs?: number },
  ): Promise<Result<T>> {
    const target = this.target;
    if (!target) {
      return Promise.resolve({ error: { code: 'transport', msg: 'client disposed (no viewer window)' } });
    }
    const id = \`\${this.idPrefix}-\${this.nextId++}\`;
    const timeoutMs = extra?.timeoutMs ?? this.timeoutMs;
    return new Promise<Result<T>>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        resolve({ error: { code: 'timeout', msg: \`\${type} timed out after \${timeoutMs} ms\` } });
      }, timeoutMs);
      this.pending.set(id, { settle: resolve as (r: Result<unknown>) => void, timer });
      const msg: Record<string, unknown> = { tredespace: TREDESPACE_PROTOCOL, id, type, payload };
      if (extra?.bytes !== undefined) {
        msg.bytes = extra.bytes;
        // ArrayBuffer -> transferred (zero-copy, detached in the host). A
        // Blob/File is passed by structured clone (by reference, no big
        // allocation). Both are plain postMessage, so cross-origin embedding
        // is unaffected.
        if (extra.bytes instanceof ArrayBuffer) {
          target.postMessage(msg, this.origin, [extra.bytes]);
        } else {
          target.postMessage(msg, this.origin);
        }
      } else {
        target.postMessage(msg, this.origin);
      }
    });
  }

  private handle(e: MessageEvent) {
    if (this.origin !== '*' && e.origin !== this.origin) {
      return;
    }
    const d = e.data as {
      tredespace?: number;
      id?: string | null;
      type?: string;
      ok?: boolean;
      payload?: unknown;
      error?: { code: TredespaceErrorCode; message: string };
    };
    if (d?.tredespace !== TREDESPACE_PROTOCOL || typeof d.type !== 'string') {
      return;
    }
    if (d.type === 'app.ready') {
      this.readyPayload = d.payload as AppReady;
      for (const w of this.readyWaiters) {
        w(this.readyPayload);
      }
      this.readyWaiters = [];
      return;
    }
    if (!d.id) {
      // unsolicited app → host event (id: null), e.g. tree.select
      const handlers = this.eventHandlers.get(d.type);
      if (handlers) {
        for (const h of [...handlers]) {
          h(d.payload);
        }
      }
      return;
    }
    const p = this.pending.get(d.id);
    if (!p) {
      return;
    }
    this.pending.delete(d.id);
    clearTimeout(p.timer);
    if (d.ok) {
      p.settle({ data: d.payload });
    } else {
      const wire = d.error ?? { code: 'internal' as const, message: 'unknown error' };
      p.settle({ error: { code: wire.code, msg: wire.message, err: wire } });
    }
  }
}
`,t={protocol:`1`,generatedFrom:`api/tredespace-client.ts`,groups:[{ns:`client`,methods:[{name:`ready`,command:null,signature:`ready(): Promise<AppReady>`,doc:`Resolves once the viewer has announced app.ready (queues until then).`,example:null,sample:null},{name:`dispose`,command:null,signature:`dispose(): void`,doc:"Detach the message listener and settle every in-flight request with a\n`transport` error. Call when the host tears down the iframe.",example:null,sample:null},{name:`assetsImportAndLoad`,command:null,signature:`assetsImportAndLoad(
  input: Parameters<TredespaceClient['assetsImport']>[0] & {
    fit?: boolean;
  }
): Promise<Result<AssetsImportResult & {
  loaded: number;
}>>`,doc:`Import then immediately load the produced assets - the "import a sample and
show it" flow. Returns the import result plus how many were loaded.`,example:null,sample:null},{name:`on`,command:null,signature:`on(type: string, handler: (payload: unknown) => void): () => void`,doc:"Listen for an app event (`id: null` messages, e.g. 'tree.select').\nReturns an unsubscribe function.",example:null,sample:null},{name:`onTreeSelect`,command:null,signature:`onTreeSelect(handler: (e: TreeSelectEvent) => void): () => void`,doc:`Typed convenience for the tree-click event.`,example:null,sample:null},{name:`onInstanceChanged`,command:null,signature:`onInstanceChanged(
  handler: (e: {
    data: Record<string, unknown>;
  }) => void
): () => void`,doc:`Typed convenience for instance-data changes (any dialog called instance.set).`,example:null,sample:null}]},{ns:`selection`,methods:[{name:`selectionSet`,command:`selection.set`,signature:`selectionSet(fullnames: string[]): Promise<Result<SelectionSetResult>>`,doc:"Replace the selection by fullname (reveals the first hit in the tree).\n`missed` lists fullnames that resolved to nothing.",example:`payload:  { fullnames: ['/TP400-PIPE-01', '/TP400-PIPE-02'] }
response: { matched: 2, missed: [] }`,sample:`const res = await client.selectionSet(['/TP400-PIPE-01', '/TP400-PIPE-02']);
// res.data →
{ matched: 2, missed: [] }`},{name:`selectionClear`,command:`selection.clear`,signature:`selectionClear(): Promise<Result<Record<string, never>>>`,doc:`Clear the current selection.`,example:`payload:  {}
response: {}`,sample:`const res = await client.selectionClear();
// res.data →
{}`},{name:`selectionGet`,command:`selection.get`,signature:`selectionGet(): Promise<Result<SelectionGetResult>>`,doc:`Read the current selection roots as fullnames.`,example:`payload:  {}
response: { count: 12, fullnames: ['/TP400-PIPE-01', ...] }  // selection roots`,sample:`const res = await client.selectionGet();
// res.data →
{ count: 12, fullnames: ['/TP400-PIPE-01', ...] }  // selection roots`}]},{ns:`labels`,methods:[{name:`labelsSet`,command:`labels.set`,signature:`labelsSet(labels: LabelInput[]): Promise<Result<LabelsResult>>`,doc:"Replace all scene labels. Each label anchors either to a world-space\n`anchor` point or to a `fullname` (the item's bounds centre); `missed`\nlists fullnames that resolved to nothing.",example:`payload: { labels: [
  { text: 'Check **this** flange', fullname: '/TP400-PIPE-01' },
  { text: 'Hand note', anchor: [12.5, 3.2, 8.0] },
] }
response: { added: 2, missed: [] }   // missed = unresolvable fullnames`,sample:`const res = await client.labelsSet([
  { text: 'Check **this** flange', fullname: '/TP400-PIPE-01' },
  { text: 'Hand note', anchor: [12.5, 3.2, 8.0] },
]);
// res.data →
{ added: 2, missed: [] }   // missed = unresolvable fullnames`},{name:`labelsAdd`,command:`labels.add`,signature:`labelsAdd(labels: LabelInput[]): Promise<Result<LabelsResult>>`,doc:`Append scene labels (same anchor forms as ).`,example:`payload: { labels: [
  { text: 'Check **this** flange', fullname: '/TP400-PIPE-01' },
  { text: 'Hand note', anchor: [12.5, 3.2, 8.0] },
] }
response: { added: 2, missed: [] }   // missed = unresolvable fullnames`,sample:`const res = await client.labelsAdd([
  { text: 'Check **this** flange', fullname: '/TP400-PIPE-01' },
  { text: 'Hand note', anchor: [12.5, 3.2, 8.0] },
]);
// res.data →
{ added: 2, missed: [] }   // missed = unresolvable fullnames`},{name:`labelsClear`,command:`labels.clear`,signature:`labelsClear(): Promise<Result<Record<string, never>>>`,doc:`Remove every scene label.`,example:`payload:  {}
response: {}`,sample:`const res = await client.labelsClear();
// res.data →
{}`},{name:`labelsExplode`,command:`labels.explode`,signature:`labelsExplode(): Promise<Result<Record<string, never>>>`,doc:`Spread overlapping labels apart from their anchors (the in-app explode).`,example:`payload:  {}
response: {}`,sample:`const res = await client.labelsExplode();
// res.data →
{}`},{name:`labelsImplode`,command:`labels.implode`,signature:`labelsImplode(): Promise<Result<Record<string, never>>>`,doc:`Pull exploded labels back onto their anchor points.`,example:`payload:  {}
response: {}`,sample:`const res = await client.labelsImplode();
// res.data →
{}`}]},{ns:`measurements`,methods:[{name:`measurementsSet`,command:`measurements.set`,signature:`measurementsSet(
  measurements: MeasurementInput[]
): Promise<Result<{
  added: number;
}>>`,doc:`Replace all measurements (world-space points; same shape as the
measurements JSON export).`,example:`payload: { measurements: [
  { kind: 'line', points: [{ pos: [0,0,0] }, { pos: [0,0,2.5] }], label: 'riser' },
] }
response: { added: 1 }`,sample:`const res = await client.measurementsSet([
  { kind: 'line', points: [{ pos: [0,0,0] }, { pos: [0,0,2.5] }], label: 'riser' },
]);
// res.data →
{ added: 1 }`},{name:`measurementsAdd`,command:`measurements.add`,signature:`measurementsAdd(
  measurements: MeasurementInput[]
): Promise<Result<{
  added: number;
}>>`,doc:`Append measurements (same shape as ).`,example:`payload: { measurements: [
  { kind: 'line', points: [{ pos: [0,0,0] }, { pos: [0,0,2.5] }], label: 'riser' },
] }
response: { added: 1 }`,sample:`const res = await client.measurementsAdd([
  { kind: 'line', points: [{ pos: [0,0,0] }, { pos: [0,0,2.5] }], label: 'riser' },
]);
// res.data →
{ added: 1 }`},{name:`measurementsClear`,command:`measurements.clear`,signature:`measurementsClear(): Promise<Result<Record<string, never>>>`,doc:`Remove every measurement.`,example:`payload:  {}
response: {}`,sample:`const res = await client.measurementsClear();
// res.data →
{}`}]},{ns:`colorRules`,methods:[{name:`colorRulesSet`,command:`colorRules.set`,signature:`colorRulesSet(
  rules: ColorRuleInput[],
  opts?: {
    mode?: 'reset' | 'append' | 'hide';
    run?: boolean;
  }
): Promise<Result<ColorRulesResult>>`,doc:"Replace the Set-Color rules. `mode:'append'` keeps existing rules\n(default 'reset' replaces); `mode:'hide'` runs hide-model style — hide\neverything, the rules unhide and colour their matches; `run:true`\napplies them immediately.",example:`payload: { mode: 'append', run: true, rules: [
  { comment: 'inspection', enabled: true, color: '#ff8800', opacity: 1,
    filters: [{ op: 'append', mode: 'contains', value: 'PIPE', comment: '' }] },
] }
response: { rules: 3, ran: true, matches: [192308] }`,sample:`const res = await client.colorRulesSet([
  { comment: 'inspection', enabled: true, color: '#ff8800', opacity: 1,
    filters: [{ op: 'append', mode: 'contains', value: 'PIPE', comment: '' }] },
], { mode: 'append', run: true });
// res.data →
{ rules: 3, ran: true, matches: [192308] }`},{name:`colorRulesAdd`,command:`colorRules.add`,signature:`colorRulesAdd(
  rules: ColorRuleInput[],
  opts?: {
    run?: boolean;
  }
): Promise<Result<ColorRulesResult>>`,doc:"Append Set-Color rules; `run:true` applies them immediately.",example:`payload: { mode: 'append', run: true, rules: [
  { comment: 'inspection', enabled: true, color: '#ff8800', opacity: 1,
    filters: [{ op: 'append', mode: 'contains', value: 'PIPE', comment: '' }] },
] }
response: { rules: 3, ran: true, matches: [192308] }`,sample:`const res = await client.colorRulesAdd([
  { comment: 'inspection', enabled: true, color: '#ff8800', opacity: 1,
    filters: [{ op: 'append', mode: 'contains', value: 'PIPE', comment: '' }] },
], { mode: 'append', run: true });
// res.data →
{ rules: 3, ran: true, matches: [192308] }`},{name:`colorRulesRun`,command:`colorRules.run`,signature:`colorRulesRun(): Promise<Result<{ matches: number[] }>>`,doc:`Re-run the current rules against the model; returns matched item counts.`,example:`payload:  {}
response: { matches: [12, 90] }   // run; clear responds {}`,sample:`const res = await client.colorRulesRun();
// res.data →
{ matches: [12, 90] }   // run; clear responds {}`},{name:`colorRulesClear`,command:`colorRules.clear`,signature:`colorRulesClear(): Promise<Result<Record<string, never>>>`,doc:`Remove all Set-Color rules. Does NOT restore already-painted colors — use
 for that.`,example:`payload:  {}
response: { matches: [12, 90] }   // run; clear responds {}`,sample:`const res = await client.colorRulesClear();
// res.data →
{ matches: [12, 90] }   // run; clear responds {}`},{name:`colorRulesResetModel`,command:`colorRules.resetModel`,signature:`colorRulesResetModel(): Promise<Result<Record<string, never>>>`,doc:`Reset the model's color/opacity overrides (the in-app Alt+R action).`,example:`payload:  {}
response: {}`,sample:`const res = await client.colorRulesResetModel();
// res.data →
{}`}]},{ns:`clip`,methods:[{name:`clipBoxFitSelected`,command:`clip.box.fitSelected`,signature:`clipBoxFitSelected(offset?: number): Promise<Result<{ offset: number }>>`,doc:"Fit the clip box to the current selection. `offset` adds a margin on every\nside for THIS call only (it doesn't change the panel's stored offset).",example:`payload:  { offset: 2 }        // or {} for a tight fit
response: { offset: 2 }`,sample:`const res = await client.clipBoxFitSelected(2);
// res.data →
{ offset: 2 }`},{name:`clipShapesAdd`,command:`clip.shapes.add`,signature:`clipShapesAdd(shapes: ClipShapeInput[]): Promise<Result<{ added: number }>>`,doc:`Append clip shapes (sphere/cylinder/box). Returns how many were added.`,example:`payload:  { shapes: [ { kind: 'sphere', center: [0,0,0], radius: 5 } ] }
response: { added: 1 }`,sample:`const res = await client.clipShapesAdd([ { kind: 'sphere', center: [0,0,0], radius: 5 } ]);
// res.data →
{ added: 1 }`},{name:`clipBoxDisable`,command:`clip.box.disable`,signature:`clipBoxDisable(): Promise<Result<Record<string, never>>>`,doc:`Turn box clipping off (leaves any clip shapes in place).`,example:`payload:  {}
response: {}`,sample:`const res = await client.clipBoxDisable();
// res.data →
{}`},{name:`clipReset`,command:`clip.reset`,signature:`clipReset(): Promise<Result<Record<string, never>>>`,doc:`Full clip reset — disable the box AND remove every clip shape.`,example:`payload:  {}
response: {}`,sample:`const res = await client.clipReset();
// res.data →
{}`}]},{ns:`nav`,methods:[{name:`navFlyTo`,command:`nav.flyTo`,signature:`navFlyTo(
  fullname: string,
  opts?: {
    select?: boolean;
  }
): Promise<Result<{
  matched: boolean;
}>>`,doc:"Fly the camera to a node by fullname. `select` also selects it (default\njust flies). `matched` is false when the fullname isn't found.",example:`payload:  { fullname: '/SITE/ZONE-1/PIPE-401', select: false }
response: { matched: true }`,sample:`const res = await client.navFlyTo('/SITE/ZONE-1/PIPE-401', { select: false });
// res.data →
{ matched: true }`},{name:`navOrbit`,command:`nav.orbit`,signature:`navOrbit(
  fullname: string,
  opts?: {
    select?: boolean;
  }
): Promise<Result<{
  matched: boolean;
}>>`,doc:"Set the orbit pivot to a node by fullname (camera stays); `select` also\nselects it. `matched` is false when the fullname isn't found.",example:`payload:  { fullname: '/SITE/ZONE-1/PIPE-401', select: false }
response: { matched: true }`,sample:`const res = await client.navOrbit('/SITE/ZONE-1/PIPE-401', { select: false });
// res.data →
{ matched: true }`}]},{ns:`settings`,methods:[{name:`settingsGet`,command:`settings.get`,signature:`settingsGet(): Promise<Result<SettingsGetResult>>`,doc:`Read-only snapshot of the persisted viewer settings, plus the app version.`,example:`payload:  {}
response: { version: '0.0.10', viewer: { sketch: false, geoEdges: true, ... } }`,sample:`const res = await client.settingsGet();
// res.data →
{ version: '0.0.10', viewer: { sketch: false, geoEdges: true, ... } }`}]},{ns:`view`,methods:[{name:`viewSketch`,command:`view.sketch`,signature:`viewSketch(on?: boolean): Promise<Result<{ sketch: boolean }>>`,doc:"Toggle sketch mode (white background + edge lines), or set it explicitly\nby passing `on`. Returns the resulting state.",example:`payload:  {}            // toggle   — or { on: true } / { on: false } to set
response: { sketch: true }`,sample:`const res = await client.viewSketch();
// res.data →
{ sketch: true }`},{name:`viewScreenshot`,command:`view.screenshot`,signature:`viewScreenshot(

): Promise<Result<{
  dataUrl: string;
  width: number;
  height: number;
}>>`,doc:"Capture the current viewport as a PNG — the converged frame (edges, AA,\nAO, view cube) plus the label and measurement overlays, exactly as shown.\nReturns a `data:image/png;base64,…` URL (drop it straight into an `<img>`\nsrc or a download link) and the pixel size.",example:`payload:  {}
response: { dataUrl: 'data:image/png;base64,iVBORw0KGgoAAA…', width: 1920, height: 1080 }`,sample:`const res = await client.viewScreenshot();
// res.data →
{ dataUrl: 'data:image/png;base64,iVBORw0KGgoAAA…', width: 1920, height: 1080 }`}]},{ns:`stores`,methods:[{name:`storesList`,command:`stores.list`,signature:`storesList(): Promise<Result<{ stores: StoreInfo[] }>>`,doc:"List the stores (projects). Fetch this first to know valid `store` names\nfor assetsList / assetsLoad / assetsImport.",example:`payload:  {}
response: { stores: [{ name: 'main', description: '', count: 12 },
                     { name: 'project-x', description: 'Client X', count: 3 }] }`,sample:`const res = await client.storesList();
// res.data →
{ stores: [{ name: 'main', description: '', count: 12 },
                     { name: 'project-x', description: 'Client X', count: 3 }] }`},{name:`storesCreate`,command:`stores.create`,signature:`storesCreate(
  name: string,
  opts?: {
    description?: string;
  }
): Promise<Result<{
  created: boolean;
  store: StoreInfo;
}>>`,doc:`Create a store (project) with an optional description. Idempotent — an
existing name (or 'main') resolves with \`created:false\` and the current
store, so it is safe to call before targeting a store you're not sure
exists. The name is sanitised (slashes → '-', trimmed, capped at 60).`,example:`payload:  { name: 'project-x', description: 'Client X' }
response: { created: true, store: { name: 'project-x', description: 'Client X', count: 0 } }`,sample:`const res = await client.storesCreate('project-x', { description: 'Client X' });
// res.data →
{ created: true, store: { name: 'project-x', description: 'Client X', count: 0 } }`}]},{ns:`assets`,methods:[{name:`assetsList`,command:`assets.list`,signature:`assetsList(store?: string): Promise<Result<{ assets: AssetInfo[] }>>`,doc:"List assets. Pass `store` to list just that store (must be a known name).",example:`payload:  { store: 'main' }   // or {} for all stores
response: { assets: [
  { id: 'mdl8f2-k3j9x', store: 'main', name: '/TP400', folder: 'Model1.rvm/TP400',
    fileName: '_TP400-PIPE.glb', md5: '9e107d9d372bb6826bd81d3542a419d6',
    size: 812345, kind: 'merged', hasNormals: false, edges: true, loaded: true },
] }`,sample:`const res = await client.assetsList('main');
// res.data →
{ assets: [
  { id: 'mdl8f2-k3j9x', store: 'main', name: '/TP400', folder: 'Model1.rvm/TP400',
    fileName: '_TP400-PIPE.glb', md5: '9e107d9d372bb6826bd81d3542a419d6',
    size: 812345, kind: 'merged', hasNormals: false, edges: true, loaded: true },
] }`},{name:`assetsImport`,command:`assets.import`,signature:`assetsImport(
  input: {
    fileName: string;
    format: ImportFormat;
    bytes: ArrayBuffer | Blob;
    folder?: string;
    store?: string;
    replace?: boolean;
    options?: Record<string, unknown>;
    onProgress?: (fraction: number) => void;
  }
): Promise<Result<AssetsImportResult>>`,doc:`Send a file for conversion into the asset manager.

\`bytes\` may be an ArrayBuffer (TRANSFERRED - unusable in the host after) or
a Blob/File (passed by reference, not detached). A Blob/File at or above
500 MB is automatically streamed in 64 MB chunks (many small postMessages,
reassembled in the viewer) so multi-GB files import without ever allocating
one huge buffer. Everything is plain postMessage - cross-origin safe.

Import does NOT render - call \`assetsLoad\` afterwards, or use
\`assetsImportAndLoad\`. \`onProgress\` (0..1) fires per chunk for large files.`,example:`payload:  { fileName: 'pump.glb', folder: 'external', store: 'project-x',
            replace: true,                // drop a prior same store/folder/name asset
            format: 'glb-standard',        // 'glb-merged' | 'glb-standard' | 'rvm' | 'ifc' | 'step'
            bytes,                         // ArrayBuffer | Blob (rides as a transferable)
            options: { normals: true, edges: true } }  // per-format options
response: { entries: [{ id: '...', store: 'project-x', name: 'pump', md5: '…',
                        size: 40213, kind: 'standard', hasNormals: true }],
            replaced: 1 }                  // # of prior assets removed by replace`,sample:`const res = await client.assetsImport({ fileName: 'pump.glb', folder: 'external', store: 'project-x',
            replace: true,
            format: 'glb-standard',
            bytes,
            options: { normals: true, edges: true } });
// res.data →
{ entries: [{ id: '...', store: 'project-x', name: 'pump', md5: '…',
                        size: 40213, kind: 'standard', hasNormals: true }],
            replaced: 1 }                  // # of prior assets removed by replace`},{name:`assetsImportUrl`,command:`assets.importUrl`,signature:`assetsImportUrl(
  files: ImportUrlFile[],
  opts?: {
    concurrent?: number;
    store?: string;
    replace?: boolean;
    onProgress?: (p: ImportUrlProgress) => void;
  }
): Promise<Result<AssetsImportUrlResult>>`,doc:"Batch-import files the VIEWER downloads by URL — no bytes cross\npostMessage. Each file names its own `format` (required — a `.glb` URL is\nambiguous). The viewer fetches up to `concurrent` files at once but cooks\nthem ONE at a time (the importer is single-locked), so `concurrent` is\nreally download parallelism — keep it modest for large RVM/IFC/STEP.\n\nOne `results` entry per input file, in order; a download or convert\nfailure is recorded there and never aborts the batch. `onProgress` fires\nper phase change while the batch runs. URLs are fetched under the VIEWER\norigin's CORS, not the host's.",example:`payload:  { files: [
              { url: 'https://cdn.example.com/pump.rvm', format: 'rvm', folder: 'plant' },
              { url: 'https://cdn.example.com/frame.ifc', format: 'ifc' },
              { url: 'https://cdn.example.com/valve.glb', format: 'glb-standard',
                options: { normals: true, edges: true } } ],
            concurrent: 3, store: 'project-x', replace: true }
response: { imported: 2, failed: 1, results: [
              { url: 'https://cdn.example.com/pump.rvm', ok: true, replaced: 0,
                entries: [{ id: '...', store: 'project-x', name: 'pump', kind: 'merged' }] },
              { url: 'https://cdn.example.com/frame.ifc', ok: true, replaced: 1,
                entries: [{ id: '...', store: 'project-x', name: 'frame', kind: 'merged' }] },
              { url: 'https://cdn.example.com/valve.glb', ok: false,
                error: 'download failed: HTTP 404 Not Found' } ] }`,sample:`const res = await client.assetsImportUrl([
              { url: 'https://cdn.example.com/pump.rvm', format: 'rvm', folder: 'plant' },
              { url: 'https://cdn.example.com/frame.ifc', format: 'ifc' },
              { url: 'https://cdn.example.com/valve.glb', format: 'glb-standard',
                options: { normals: true, edges: true } } ], { concurrent: 3, store: 'project-x', replace: true });
// res.data →
{ imported: 2, failed: 1, results: [
              { url: 'https://cdn.example.com/pump.rvm', ok: true, replaced: 0,
                entries: [{ id: '...', store: 'project-x', name: 'pump', kind: 'merged' }] },
              { url: 'https://cdn.example.com/frame.ifc', ok: true, replaced: 1,
                entries: [{ id: '...', store: 'project-x', name: 'frame', kind: 'merged' }] },
              { url: 'https://cdn.example.com/valve.glb', ok: false,
                error: 'download failed: HTTP 404 Not Found' } ] }`},{name:`assetsLoad`,command:`assets.load`,signature:`assetsLoad(
  ids: string[],
  opts?: {
    fit?: boolean;
    store?: string;
  }
): Promise<Result<{
  loaded: number;
}>>`,doc:"Render imported assets into the viewer. `fit:true` (default) frames them.\nPair with , or use .",example:`payload:  { ids: ['mdl8f2-k3j9x'], fit: true, store: 'project-x' }  // fit = frame the batch
response: { loaded: 1 }`,sample:`const res = await client.assetsLoad(['mdl8f2-k3j9x'], { fit: true, store: 'project-x' });
// res.data →
{ loaded: 1 }`},{name:`assetsUnload`,command:`assets.unload`,signature:`assetsUnload(ids: string[]): Promise<Result<{ unloaded: number }>>`,doc:`Remove assets from the viewport (they stay in the asset manager).`,example:`payload:  { ids: ['mdl8f2-k3j9x'], fit: true, store: 'project-x' }  // fit = frame the batch
response: { loaded: 1 }`,sample:`const res = await client.assetsUnload(['mdl8f2-k3j9x']);
// res.data →
{ loaded: 1 }`},{name:`assetsRemove`,command:`assets.remove`,signature:`assetsRemove(
  ids: string[],
  opts?: {
    store?: string;
  }
): Promise<Result<{
  removed: number;
}>>`,doc:`Delete persisted assets from local storage (OPFS). A copy already loaded
into the viewer stays on screen - import -> load -> remove leaves a
session-only model with nothing on disk.`,example:`payload:  { ids: ['mdl8f2-k3j9x'], store: 'project-x' }
response: { removed: 1 }`,sample:`const res = await client.assetsRemove(['mdl8f2-k3j9x'], { store: 'project-x' });
// res.data →
{ removed: 1 }`}]},{ns:`sql`,methods:[{name:`sqlList`,command:`sql.list`,signature:`sqlList(store?: string): Promise<Result<{ dbs: SqlDbInfo[] }>>`,doc:"List SQLite databases. Pass `store` to list just that store (a known\nname). Each db's `path` is what you pass as `mainDb` to `sqlQuery`.",example:`payload:  { store: 'main' }   // or {} for all stores
response: { dbs: [
  { store: 'main', fileName: 'meta.db', path: 'sql_assets/main/meta.db',
    size: 61440, modified: 1721600000000 },
] }`,sample:`const res = await client.sqlList('main');
// res.data →
{ dbs: [
  { store: 'main', fileName: 'meta.db', path: 'sql_assets/main/meta.db',
    size: 61440, modified: 1721600000000 },
] }`},{name:`sqlImport`,command:`sql.import`,signature:`sqlImport(
  input: {
    fileName: string;
    bytes: ArrayBuffer | Blob;
    store?: string;
    replace?: boolean;
  }
): Promise<Result<SqlImportResult>>`,doc:`Import a .db/.sqlite file into a store (default 'main'). \`bytes\` is an
ArrayBuffer (TRANSFERRED — unusable after) or a Blob/File (by reference).
\`replace: true\` overwrites an existing same-name db; false (default) skips
it. WAL databases are normalised to rollback journalling on the way in
(the OPFS VFS is shm-less, so WAL can't be read shared).`,example:`iframe.contentWindow.postMessage({
  tredespace: 1, id: 'req-9', type: 'sql.import',
  payload: { fileName: 'meta.db', store: 'main', replace: true },
  bytes,                                    // ArrayBuffer, listed as transferable
}, origin, [bytes]);

response: { imported: ['sql_assets/main/meta.db'], skipped: [], replaced: 1 }`,sample:null},{name:`sqlDelete`,command:`sql.delete`,signature:`sqlDelete(
  paths: string[]
): Promise<Result<{
  deleted: string[];
  skipped: string[];
}>>`,doc:"Delete databases by their OPFS `path` (from `sqlList`). A path in use by a\nrunning query (or another tab) is skipped, not waited on.",example:`payload:  { paths: ['sql_assets/main/meta.db'] }
response: { deleted: ['sql_assets/main/meta.db'], skipped: [] }`,sample:`const res = await client.sqlDelete(['sql_assets/main/meta.db']);
// res.data →
{ deleted: ['sql_assets/main/meta.db'], skipped: [] }`},{name:`sqlQuery`,command:`sql.query`,signature:`sqlQuery(
  input: {
    sql: string;
    mainDb: string;
    lockmode?: 'shared' | 'exclusive';
    maxRows?: number;
  }
): Promise<Result<SqlQueryResult>>`,doc:"Run SQL against `mainDb` (a path from `sqlList`). ATTACH other databases\ninline with their OPFS path and they are locked automatically. `lockmode`\ndefaults to 'shared' (read-only, several readers at once); pass\n'exclusive' to write. Rows per statement are capped at `maxRows` (default\n10000; a cut statement carries `truncated: true`). Results come back one\nentry per statement, in order.",example:`payload:  { mainDb: 'sql_assets/main/meta.db',
            sql: "SELECT id, name FROM part LIMIT 2;",
            lockmode: 'shared', maxRows: 10000 }
response: { statements: [
  { columns: ['id', 'name'], rows: [[1, 'Flange'], [2, 'Bolt']], rowCount: 2 },
], ms: 4.1 }`,sample:`const res = await client.sqlQuery({ mainDb: 'sql_assets/main/meta.db',
            sql: "SELECT id, name FROM part LIMIT 2;",
            lockmode: 'shared', maxRows: 10000 });
// res.data →
{ statements: [
  { columns: ['id', 'name'], rows: [[1, 'Flange'], [2, 'Bolt']], rowCount: 2 },
], ms: 4.1 }`}]},{ns:`ui`,methods:[{name:`uiKiosk`,command:`ui.kiosk`,signature:`uiKiosk(on?: boolean): Promise<Result<{ kiosk: boolean }>>`,doc:"Toggle kiosk mode (viewport only — panels hidden). Omit `on` to query\nthe current state without changing it.",example:`payload:  { on: true }        // or {} to just query
response: { kiosk: true }     // state after the call`,sample:`const res = await client.uiKiosk(true);
// res.data →
{ kiosk: true }     // state after the call`},{name:`uiTheme`,command:`ui.theme`,signature:`uiTheme(
  theme?: 'dark' | 'light'
): Promise<Result<{
  theme: 'dark' | 'light';
}>>`,doc:`Set the viewer's colour theme, or omit \`theme\` to query the current one
without changing it. Handy for keeping an embedded viewer in step with the
host page's light/dark mode.`,example:`payload:  { theme: 'light' }   // 'dark' | 'light'; or {} to just query
response: { theme: 'light' }   // theme after the call`,sample:`const res = await client.uiTheme('light');
// res.data →
{ theme: 'light' }   // theme after the call`},{name:`uiClose`,command:`ui.close`,signature:`uiClose(): Promise<Result<{ closed: boolean }>>`,doc:`Ask the viewer to close the dialog/panel hosting THIS window (embedded
external apps closing themselves, e.g. a project selector after pick).`,example:`payload:  {}
response: { closed: true }`,sample:`const res = await client.uiClose();
// res.data →
{ closed: true }`},{name:`uiShowPanel`,command:`ui.showPanel`,signature:`uiShowPanel(panel: string): Promise<Result<{ shown: boolean }>>`,doc:`Open / close a dock panel by id (e.g. 'hierarchy').`,example:`payload:  { panel: 'hierarchy' }
response: { shown: true }        // hidePanel → { hidden: true }`,sample:`const res = await client.uiShowPanel('hierarchy');
// res.data →
{ shown: true }        // hidePanel → { hidden: true }`},{name:`uiHidePanel`,command:`ui.hidePanel`,signature:`uiHidePanel(panel: string): Promise<Result<{ hidden: boolean }>>`,doc:`Hide a dock panel by id (counterpart of ).`,example:`payload:  { panel: 'hierarchy' }
response: { shown: true }        // hidePanel → { hidden: true }`,sample:`const res = await client.uiHidePanel('hierarchy');
// res.data →
{ shown: true }        // hidePanel → { hidden: true }`},{name:`uiLoadingShow`,command:`ui.loading.show`,signature:`uiLoadingShow(
  opts?: {
    header?: string;
    title?: string;
  }
): Promise<Result<Record<string, never>>>`,doc:"Show / hide the blocking loading overlay. `header` is the bold title line,\n`title` the message below it.",example:`payload:  { header: 'Please wait', title: 'Loading project…' }   // hide: {}
response: {}`,sample:`const res = await client.uiLoadingShow({ header: 'Please wait', title: 'Loading project…' });
// res.data →
{}`},{name:`uiLoadingHide`,command:`ui.loading.hide`,signature:`uiLoadingHide(): Promise<Result<Record<string, never>>>`,doc:`Hide the blocking loading overlay shown by .`,example:`payload:  { header: 'Please wait', title: 'Loading project…' }   // hide: {}
response: {}`,sample:`const res = await client.uiLoadingHide();
// res.data →
{}`},{name:`uiConfirm`,command:`ui.confirm`,signature:`uiConfirm(
  opts: {
    question: string;
    header?: string;
    yes?: string;
    no?: string;
  }
): Promise<Result<{
  confirmed: boolean;
}>>`,doc:`Show a confirm dialog; resolves with the user's choice.`,example:`payload:  { question: 'Discard changes?', header: 'Confirm', yes: 'Discard', no: 'Keep' }
response: { confirmed: true }`,sample:`const res = await client.uiConfirm({ question: 'Discard changes?', header: 'Confirm', yes: 'Discard', no: 'Keep' });
// res.data →
{ confirmed: true }`},{name:`uiError`,command:`ui.error`,signature:`uiError(
  opts: {
    title: string;
    header?: string;
  }
): Promise<Result<Record<string, never>>>`,doc:"Show an error dialog. `title` is the message, `header` the bold title.",example:`payload:  { title: 'Import failed — see console.', header: 'Error' }
response: {}`,sample:`const res = await client.uiError({ title: 'Import failed — see console.', header: 'Error' });
// res.data →
{}`}]},{ns:`instance`,methods:[{name:`instanceSet`,command:`instance.set`,signature:`instanceSet(
  data: Record<string, unknown>,
  opts?: {
    merge?: boolean;
  }
): Promise<Result<{
  data: Record<string, unknown>;
}>>`,doc:`Replace (default) or merge the viewer's shared instance data — one JSON
object per viewer window, for cross-dialog coordination. Every host gets
an \`instance.changed\` event afterwards.`,example:`payload:  { data: { project: 'P-42', role: 'review' }, merge: false }
response: { data: { project: 'P-42', role: 'review' } }   // state after the call
// instance.get: payload {} → same response shape`,sample:`const res = await client.instanceSet({ project: 'P-42', role: 'review' }, { merge: false });
// res.data →
{ data: { project: 'P-42', role: 'review' } }   // state after the call
// instance.get: payload {} → same response shape`},{name:`instanceGet`,command:`instance.get`,signature:`instanceGet(): Promise<Result<{ data: Record<string, unknown> }>>`,doc:`Read the viewer's shared instance data (see ).`,example:`payload:  { data: { project: 'P-42', role: 'review' }, merge: false }
response: { data: { project: 'P-42', role: 'review' } }   // state after the call
// instance.get: payload {} → same response shape`,sample:`const res = await client.instanceGet();
// res.data →
{ data: { project: 'P-42', role: 'review' } }   // state after the call
// instance.get: payload {} → same response shape`}]}],types:[{name:`TredespaceErrorCode`,kind:`alias`,doc:`Failure codes: the five protocol codes the viewer can return, plus two
host-side ones — a request that timed out, or a dead transport (disposed
client / no viewer window).`,def:`| 'bad-payload' | 'not-ready' | 'busy' | 'not-found' | 'internal' | 'timeout' | 'transport'`},{name:`TredespaceError`,kind:`interface`,doc:"Failure detail on a . `msg` is a human-readable string safe to\nshow a user; `err` is the underlying detail when there is one (the raw wire\nerror, or a caught exception).",fields:[{text:`code: TredespaceErrorCode;`,doc:``},{text:`msg: string;`,doc:``},{text:`err?: unknown;`,doc:``}]},{name:`Result`,kind:`interface`,doc:"Rust-style result — exactly one of `data` / `error` is present. Command\nmethods resolve this and NEVER throw; check `error` (or `data`).\n\n```ts\nconst res = await client.selectionSet(['/SITE/PIPE-01']);\nif (res.error) console.warn(res.error.msg);\nelse console.log(res.data.matched);\n```",fields:[{text:`data?: T;`,doc:``},{text:`error?: TredespaceError;`,doc:``}]},{name:`AppReady`,kind:`interface`,doc:``,fields:[{text:`version: string;`,doc:``},{text:`api: number;`,doc:``}]},{name:`SelectionSetResult`,kind:`interface`,doc:``,fields:[{text:`matched: number;`,doc:``},{text:`missed: string[];`,doc:``}]},{name:`SelectionGetResult`,kind:`interface`,doc:``,fields:[{text:`count: number;`,doc:``},{text:`fullnames: string[];`,doc:`selection roots as fullnames`}]},{name:`LabelInput`,kind:`interface`,doc:``,fields:[{text:`text: string;`,doc:`shown text — supports **bold** and newlines in rich mode`},{text:`fullname?: string;`,doc:`anchor to a model item by fullname (bounds centre)…`},{text:`anchor?: [number, number, number];`,doc:`…or at an explicit world-space point`}]},{name:`LabelsResult`,kind:`interface`,doc:``,fields:[{text:`added: number;`,doc:``},{text:`missed: string[];`,doc:`fullnames that resolved to nothing`}]},{name:`MeasurePointInput`,kind:`interface`,doc:``,fields:[{text:`pos: [number, number, number];`,doc:``}]},{name:`MeasurementInput`,kind:`interface`,doc:``,fields:[{text:`kind: 'point' | 'line' | 'path' | 'area' | 'diameter' | 'angle';`,doc:``},{text:`points: MeasurePointInput[];`,doc:``},{text:`label?: string;`,doc:``}]},{name:`FilterRowInput`,kind:`interface`,doc:``,fields:[{text:`op: 'append' | 'remove';`,doc:``},{text:`mode: 'contains' | 'single' | 'multi' | 'starts' | 'ends' | 'wildcard';`,doc:`contains | single (equals, * at start/end) | starts | ends |
wildcard (equals, * anywhere) | multi (one name per line)`},{text:`value: string;`,doc:``},{text:`comment?: string;`,doc:``},{text:`level?: number;`,doc:`Hierarchy level (1-9) the filter is applied TO, counted like the tree
panel (import folders included): the row matches only the names at that
level and each match includes its whole subtree. Level 1 tests the
import-folder name (a hit takes everything under the folder).
0/omitted = match at any level.`}]},{name:`ColorRuleInput`,kind:`interface`,doc:``,fields:[{text:`comment?: string;`,doc:``},{text:`enabled?: boolean;`,doc:``},{text:`filters: FilterRowInput[];`,doc:``},{text:`color: string | null;`,doc:`hex color, or null = restore default`},{text:`opacity?: number;`,doc:`0-1, 1 = default`}]},{name:`ClipShapeInput`,kind:`interface`,doc:`A clip shape to append (sphere / cylinder / box). Only \`kind\` is required;
the rest default (center [0,0,0], radius 5, height 10, box halfExtents
[1,1,1], identity rotation, enabled, not inverted).`,fields:[{text:`kind: 'sphere' | 'cylinder' | 'box';`,doc:``},{text:`label?: string;`,doc:``},{text:`center?: [number, number, number];`,doc:``},{text:`axis?: [number, number, number];`,doc:``},{text:`radius?: number;`,doc:``},{text:`height?: number;`,doc:``},{text:`halfExtents?: [number, number, number];`,doc:``},{text:`rotation?: [number, number, number, number];`,doc:``},{text:`enabled?: boolean;`,doc:``},{text:`inverted?: boolean;`,doc:`clip INSIDE the shape (a hole) instead of outside`},{text:`showHelper?: boolean;`,doc:``}]},{name:`ColorRulesResult`,kind:`interface`,doc:``,fields:[{text:`rules: number;`,doc:``},{text:`ran: boolean;`,doc:``},{text:`matches: number[];`,doc:``}]},{name:`SettingsGetResult`,kind:`interface`,doc:``,fields:[{text:`version: string;`,doc:``},{text:`viewer: Record<string, unknown>;`,doc:`the persisted viewer-settings snapshot (read-only)`}]},{name:`AssetInfo`,kind:`interface`,doc:``,fields:[{text:`id: string;`,doc:``},{text:`store: string;`,doc:`the store this asset belongs to (default 'main')`},{text:`name: string;`,doc:``},{text:`folder: string;`,doc:``},{text:`fileName: string;`,doc:``},{text:`md5?: string;`,doc:`MD5 of the source bytes — compare to decide whether to re-import`},{text:`size: number;`,doc:``},{text:`kind?: 'merged' | 'standard';`,doc:``},{text:`hasNormals?: boolean;`,doc:``},{text:`edges?: boolean;`,doc:``},{text:`loaded: boolean;`,doc:``}]},{name:`StoreInfo`,kind:`interface`,doc:`A store = a named group of assets (a project). 'main' always exists.`,fields:[{text:`name: string;`,doc:``},{text:`description: string;`,doc:``},{text:`count: number;`,doc:``}]},{name:`ImportFormat`,kind:`alias`,doc:``,def:`'glb-merged' | 'glb-standard' | 'rvm' | 'ifc' | 'step'`},{name:`AssetsImportResult`,kind:`interface`,doc:``,fields:[{text:`entries: AssetInfo[];`,doc:``},{text:`replaced: number;`,doc:"how many prior assets were removed by `replace` (0 unless replace was set)"}]},{name:`ImportUrlFile`,kind:`interface`,doc:"One file for : a URL the VIEWER\ndownloads itself, plus the pipeline to cook it with. `format` is required\n(a `.glb` URL is ambiguous — merged vs standard — so no format is inferred\non the wire; infer it host-side from the extension if you like).",fields:[{text:`url: string;`,doc:`URL the viewer fetches (subject to the VIEWER origin's CORS, not yours).`},{text:`format: ImportFormat;`,doc:``},{text:`fileName?: string;`,doc:`name to store the asset under; defaults to the URL's last path segment.`},{text:`folder?: string;`,doc:``},{text:`options?: Record<string, unknown>;`,doc:"per-format options, e.g. `{ normals: true, edges: true }` for glb-standard."}]},{name:`AssetsImportUrlEntry`,kind:`interface`,doc:`Per-file outcome within an . Exactly one batch
entry per input file, in input order; a failure here never aborts the rest.`,fields:[{text:`url: string;`,doc:``},{text:`ok: boolean;`,doc:``},{text:`entries?: AssetInfo[];`,doc:"assets produced (present when `ok`)."},{text:`replaced?: number;`,doc:"prior assets removed by `replace` for this file (present when `ok`)."},{text:`error?: string;`,doc:"why this file failed (present when not `ok`) — download or convert error."}]},{name:`AssetsImportUrlResult`,kind:`interface`,doc:``,fields:[{text:`imported: number;`,doc:`number of files that imported successfully.`},{text:`failed: number;`,doc:`number of files that failed (download or convert).`},{text:`results: AssetsImportUrlEntry[];`,doc:``}]},{name:`ImportUrlProgress`,kind:`interface`,doc:"Progress tick for  — one per phase\nchange. `completed`/`total` count whole files; `phase` is what just started\n(`download`/`convert`) or ended (`done`/`error`) for `url`.",fields:[{text:`completed: number;`,doc:``},{text:`total: number;`,doc:``},{text:`url: string;`,doc:``},{text:`phase: 'download' | 'convert' | 'done' | 'error';`,doc:``}]},{name:`SqlDbInfo`,kind:`interface`,doc:"One SQLite database in OPFS (`sql_assets/<store>/<file>`). Stores are shared\nwith model assets. `path` is what you pass as `mainDb` to `sqlQuery`, and\nwhat an ATTACH string literal references.",fields:[{text:`store: string;`,doc:``},{text:`fileName: string;`,doc:``},{text:`path: string;`,doc:``},{text:`size: number;`,doc:``},{text:`modified: number;`,doc:``}]},{name:`SqlImportResult`,kind:`interface`,doc:``,fields:[{text:`imported: string[];`,doc:`OPFS paths of the databases written.`},{text:`skipped: string[];`,doc:"file names skipped — already existed without `replace`, or the file was locked."},{text:`replaced: number;`,doc:`how many existing databases were overwritten.`}]},{name:`SqlStatementResult`,kind:`interface`,doc:``,fields:[{text:`columns: string[] | null;`,doc:`column names, or null for a statement that returned no result set.`},{text:`rows: unknown[];`,doc:"result rows as compact value arrays (parallel to `columns`)."},{text:`rowCount: number;`,doc:"total rows the statement produced, before any `maxRows` truncation."},{text:`truncated?: boolean;`,doc:"present + true when `rows` was cut to `maxRows`."}]},{name:`SqlQueryResult`,kind:`interface`,doc:``,fields:[{text:`statements: SqlStatementResult[];`,doc:`one entry per statement in the script, in order.`},{text:`ms: number;`,doc:`wall-clock milliseconds for the run.`}]},{name:`TreeSelectParent`,kind:`interface`,doc:"One ancestor of a clicked tree row. `folder` entries are import folders\n(with their cumulative path); `node` entries are model hierarchy levels.",fields:[{text:`name: string;`,doc:``},{text:`type: 'folder' | 'node';`,doc:``},{text:`path?: string;`,doc:`cumulative folder path — folder parents only`}]},{name:`TreeSelectEvent`,kind:`interface`,doc:"Unsolicited `tree.select` event: the user clicked a row in the tree view.",fields:[{text:`fullname: string;`,doc:`fullname of the clicked node (folder path for folder rows)`},{text:`name: string;`,doc:``},{text:`folder: boolean;`,doc:`true for import folders and hierarchy nodes with children`},{text:`group?: string;`,doc:`the import folder the model lives in (item rows only)`},{text:`parents: TreeSelectParent[];`,doc:`every parent up to the root, outermost first`}]},{name:`TredespaceClientOptions`,kind:`interface`,doc:``,fields:[{text:`targetOrigin: string;`,doc:`The viewer's origin, e.g. 'https://viewer.example.com'. Required.`},{text:`timeoutMs?: number;`,doc:`Per-command timeout (ms). Imports use importTimeoutMs. Default 30 000.`},{text:`importTimeoutMs?: number;`,doc:`Timeout for assets.import (conversions can be long). Default 600 000.`}]}],methodCount:54,problems:[]},n=e=>document.getElementById(e),r=new Set,i=new Map(t.types.map(e=>[e.name,e]));for(let e of t.types)r.add(e.name);function a(e){if(e.kind===`alias`||!e.fields)return`type ${e.name} = ${e.def??`unknown`};`;let t=[`interface ${e.name} {`];for(let n of e.fields)n.doc&&t.push(`  /** ${n.doc.replace(/\s+/g,` `).trim()} */`),t.push(`  ${n.text.replace(/;\s*$/,``)};`);return t.push(`}`),t.join(`
`)}var o=e=>e.replace(/[&<>]/g,e=>e===`&`?`&amp;`:e===`<`?`&lt;`:`&gt;`);function s(e){return o(e).replace(/\{@link\s+([^}]+)\}/g,(e,t)=>`<code>${o(String(t).trim())}</code>`).replace(/`([^`]+)`/g,(e,t)=>`<code>${o(String(t))}</code>`).replace(/\n/g,` `)}var c=new Set(`string.number.boolean.void.null.undefined.unknown.any.never.readonly.true.false.object.symbol.bigint.interface.type.extends.const.await.new.return.import.from.if.else`.split(`.`)),l=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s])/g;function u(e,t=!1){let n=``,i=!1;return e.replace(l,(e,a,s,l,u,d,f)=>(a?n+=`<span class="hl-cm">${o(a)}</span>`:s?n+=`<span class="hl-st">${o(s)}</span>`:l?n+=`<span class="hl-nu">${o(l)}</span>`:u?(t&&!i?n+=`<span class="hl-fn">${o(u)}</span>`:c.has(u)?n+=`<span class="hl-kw">${o(u)}</span>`:/^[A-Z]/.test(u)&&r.has(u)?n+=`<button type="button" class="hl-ty type-link" data-type="${o(u)}">${o(u)}</button>`:/^[A-Z]/.test(u)?n+=`<span class="hl-ty">${o(u)}</span>`:n+=o(u),i=!0):d?n+=d:n+=o(f),``)),n}var d=n(`genMeta`);d&&(d.textContent=`generated from ${t.generatedFrom} · ${t.methodCount} commands · protocol v${t.protocol}`);var f=n(`refNav`);if(f)for(let e of t.groups){let t=document.createElement(`a`);t.className=`ref-pill`,t.href=`#ns-${e.ns}`,t.textContent=e.ns,f.appendChild(t)}var p=n(`apiRef`);if(p){p.innerHTML=``;for(let e of t.groups){let t=document.createElement(`div`);t.className=`ref-group`,t.id=`ns-${e.ns}`;let n=document.createElement(`h3`);n.innerHTML=`${o(e.ns)} <span class="ref-count">${e.methods.length}</span>`,t.appendChild(n);for(let n of e.methods){let e=document.createElement(`article`);e.className=`ref-item`,e.dataset.search=`${n.command??``} ${n.name} ${n.signature} ${n.doc} ${n.sample??n.example??``}`.toLowerCase();let r=n.command?`<span class="ref-cmd">${o(n.command)}</span>`:`<span class="ref-cmd ref-cmd-none">client</span>`,i=n.sample??n.example;e.innerHTML=`<div class="ref-head">${r}<code class="ref-method">${o(n.name)}</code></div><pre class="ref-sig">${u(n.signature,!0)}</pre>`+(n.doc?`<p class="ref-doc">${s(n.doc)}</p>`:``)+(i?`<div class="ref-example"><span class="ref-example-label">example</span><pre>${u(i,!1)}</pre></div>`:``),t.appendChild(e)}p.appendChild(t)}}var m=n(`apiTypes`);if(m)for(let e of t.types){let t=document.createElement(`article`);t.className=`type-card`,t.id=`type-${e.name}`;let n=e.fields?e.fields.map(e=>e.text).join(` `):e.def??``;t.dataset.search=`${e.name} ${e.doc} ${n}`.toLowerCase(),t.innerHTML=(e.doc?`<p class="type-doc">${s(e.doc)}</p>`:``)+`<pre class="type-sig">${u(a(e))}</pre>`,m.appendChild(t)}var h=n(`refSearch`);h?.addEventListener(`input`,()=>{let e=h.value.trim().toLowerCase();for(let t of document.querySelectorAll(`.ref-item`))t.style.display=!e||(t.dataset.search??``).includes(e)?``:`none`;for(let e of document.querySelectorAll(`.ref-group`)){let t=[...e.querySelectorAll(`.ref-item`)].some(e=>e.style.display!==`none`);e.style.display=t?``:`none`}for(let t of document.querySelectorAll(`.type-card`))t.style.display=!e||(t.dataset.search??``).includes(e)?``:`none`});var g=URL.createObjectURL(new Blob([e],{type:`text/plain;charset=utf-8`}));n(`downloadSdk`)?.addEventListener(`click`,()=>{let e=document.createElement(`a`);e.href=g,e.download=`tredespace-client.ts`,document.body.appendChild(e),e.click(),e.remove()}),n(`rawSdkLink`);var _=document.createElement(`div`);_.className=`type-pop`,_.hidden=!0,document.body.appendChild(_),document.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`.type-link`);if(n?.dataset.type){let t=i.get(n.dataset.type);if(!t)return;_.innerHTML=`<div class="type-pop-title">${o(t.name)}</div>`+(t.doc?`<p class="type-pop-doc">${s(t.doc)}</p>`:``)+`<pre>${u(a(t))}</pre>`,_.hidden=!1;let r=n.getBoundingClientRect(),c=Math.min(400,window.innerWidth-16);_.style.width=`${c}px`,_.style.left=`${Math.max(8,Math.min(window.scrollX+r.left,window.scrollX+window.innerWidth-c-8))}px`,_.style.top=`${window.scrollY+r.bottom+6}px`,e.stopPropagation()}else t.closest(`.type-pop`)||(_.hidden=!0)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&(_.hidden=!0)});