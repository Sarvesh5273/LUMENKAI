/**
 * The one place that knows where the public repo lives.
 *
 * Everything that points a student or a contributor at GitHub (the remote
 * dataset, the "report a wrong rule" issue link, the contributing guide link)
 * is derived from `REPO_URL`, so moving the repo is a one-line change.
 */

/** Public GitHub repo (the whole workspace is pushed there). The app works offline without it. */
export const REPO_URL = 'https://github.com/Sarvesh5273/LUMENKAI';

/** Branch the app reads the dataset from. */
export const REPO_BRANCH = 'main';

/** Path of the exported dataset inside the repo. Written by `pnpm export-data`. */
export const DATASET_PATH = 'artifacts/still-eligible/data/dataset.json';

/** Raw URL of the committed dataset, fetched on launch. */
export const DATASET_URL = `${REPO_URL.replace('https://github.com/', 'https://raw.githubusercontent.com/')}/${REPO_BRANCH}/${DATASET_PATH}`;

/** Prefilled "new issue" page used by the report-a-wrong-rule link. */
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;

/** How long the launch-time fetch may take before the bundled or cached copy is used. */
export const DATASET_FETCH_TIMEOUT_MS = 8_000;
