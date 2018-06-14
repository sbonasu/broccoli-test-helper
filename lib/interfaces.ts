/**
 * Interface expected by the output test helper for a builder.
 */
export interface Builder {
  /**
   * Path to output of builder.
   */
  outputPath: string;

  /**
   * Builds output.
   */
  build(): Promise<void>;

  /**
   * Cleanup temporary build artifacts.
   *
   * Current version is void return but reserves the possibility of
   * returning a promise in the future so the test helper just always
   * returns a promise for dispose.
   */
  cleanup(): Promise<void> | void;
}

export interface Disposable {
  dispose(): Promise<void>;
}

export interface ReadDirOptions {
  globs?: string[];
  ignore?: string[];
  directories?: boolean;
}

export interface ReadableDir {
  /**
   * Read the content of the directory.
   * @param from - a relative path to read from within the directory.
   */
  read(from?: string): Tree;

  /**
   * Returns the absolute path to the directory or the absolute path to the subpath if specified.
   * @param subpath - subpath within the directory.
   */
  path(subpath?: string): string;

  /**
   * EISDIR ENOENT
   * @param subpath - subpath within the directory.
   */
  readBinary(subpath: string): Buffer | undefined;

  /** EISDIR ENOENT */
  readText(subpath: string, encoding?: string): string | undefined;

  /** ENOTDIR ENOENT  */
  readDir(subpath?: string, options?: ReadDirOptions): string[] | undefined;
}

/**
 * Test helper for building output and making assertions.
 */
export interface Output extends ReadableDir, Disposable {
  /**
   * Return the builder.
   */
  builder: Builder;

  /**
   * Get changes from last build.
   */
  changes(): Changes;

  /**
   * Build output.
   * @deprecated
   */
  rebuild(): Promise<Output>;

  /**
   * Build output.
   */
  build(): Promise<void>;
}

/**
 * Change operation.
 */
export type ChangeOp = "unlink" | "create" | "mkdir" | "rmdir" | "change";

/**
 * Represents changes in output.
 */
export interface Changes {
  [path: string]: ChangeOp;
}

/**
 * A disposable temporary directory for writing mutable fixture data to.
 */
export interface TempDir extends ReadableDir, Disposable {
  /**
   * Gets the changes since the last time changes() was called or
   * since the temporary directory was created.
   */
  changes(): Changes;

  /**
   * Write to the temporary directory.
   *
   * @param content - the content to write to the temporary directory.
   * @param to - a sub path to write to within the temporary directory.
   */
  write(content: Tree, to?: string): void;

  /**
   * Copy contents of a directory to the temporary directory.
   *
   * @param from - a directory to copy from.
   * @param to - a sub path to write to within the temporary directory.
   */
  copy(from: string, to?: string): void;
}

export type TreeEntry = Tree | string | null;

/**
 * Represents a directory's contents.
 */
export interface Tree {
  /**
   * Map directory entry to a Directory or file contents or null (delete when writing directory).
   */
  [name: string]: TreeEntry | undefined;
}
