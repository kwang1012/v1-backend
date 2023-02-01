export const parsePatch = (input, options = {}) => {
  if (!input) return [];
  if (typeof input !== "string" || input.match(/^\s+$/)) return [];

  const lines = input.split("\n");
  if (lines.length === 0) return [];

  let file = {
    chunks: [],
    deletions: 0,
    additions: 0,
  };
  let currentChunk = null;
  let deletedLineCounter = 0;
  let addedLineCounter = 0;
  let currentFileChanges = null;

  const normal = (line) => {
    currentChunk?.changes.push({
      type: "normal",
      isNormal: true,
      oldLineNumber: deletedLineCounter++,
      lineNumber: addedLineCounter++,
      content: line,
    });
    currentFileChanges.oldLines--;
    currentFileChanges.newLines--;
  };

  const toNumOfLines = (number) => +(number || 1);

  const chunk = (line, match) => {
    if (!file) return;

    const [oldStart, oldNumLines, newStart, newNumLines] = match.slice(1);

    deletedLineCounter = +oldStart;
    addedLineCounter = +newStart;
    currentChunk = {
      content: line,
      changes: [],
      oldStart: +oldStart,
      oldLines: toNumOfLines(oldNumLines),
      newStart: +newStart,
      newLines: toNumOfLines(newNumLines),
    };
    currentFileChanges = {
      oldLines: toNumOfLines(oldNumLines),
      newLines: toNumOfLines(newNumLines),
    };
    file.chunks.push(currentChunk);
  };

  const del = (line) => {
    if (!currentChunk) return;

    currentChunk.changes.push({
      type: "delete",
      del: true,
      lineNumber: deletedLineCounter++,
      content: line,
    });
    file.deletions++;
    currentFileChanges.oldLines--;
  };

  const add = (line) => {
    if (!currentChunk) return;

    currentChunk.changes.push({
      type: "insert",
      add: true,
      lineNumber: addedLineCounter++,
      content: line,
    });
    file.additions++;
    currentFileChanges.newLines--;
  };

  const eof = (line) => {
    if (!currentChunk) return;

    const [mostRecentChange] = currentChunk.changes.slice(-1);

    currentChunk.changes.push({
      type: mostRecentChange.type,
      [mostRecentChange.type]: true,
      oldLineNumber: mostRecentChange.oldLineNumber,
      lineNumber: mostRecentChange.lineNumber,
      line: mostRecentChange.line,
      content: line,
    });
  };

  const schemaHeaders = [
    [/^@@\s+-(\d+),?(\d+)?\s+\+(\d+),?(\d+)?\s@@/, chunk],
    [/^\\ No newline at end of file$/, eof],
  ];

  const schemaContent = [
    [/^\\ No newline at end of file$/, eof],
    [/^-/, del],
    [/^\+/, add],
    [/^\s+/, normal],
  ];

  const parseContentLine = (line) => {
    for (const [pattern, handler] of schemaContent) {
      const match = line.match(pattern);
      if (match) {
        handler(line, match);
        break;
      }
    }
    if (
      currentFileChanges.oldLines === 0 &&
      currentFileChanges.newLines === 0
    ) {
      currentFileChanges = null;
    }
  };

  const parseHeaderLine = (line) => {
    for (const [pattern, handler] of schemaHeaders) {
      const match = line.match(pattern);
      if (match) {
        handler(line, match);
        break;
      }
    }
  };

  const parseLine = (line) => {
    if (currentFileChanges) {
      parseContentLine(line);
    } else {
      parseHeaderLine(line);
    }
    return;
  };

  for (const line of lines) parseLine(line);

  return mapFile(file, options);
};

const zipChanges = (changes) => {
  const [result] = changes.reduce(
    ([result, last, lastDeletionIndex], current, i) => {
      if (!last) {
        result.push(current);
        return [result, current, current.isDelete ? i : -1];
      }

      if (current.isInsert && lastDeletionIndex >= 0) {
        result.splice(lastDeletionIndex + 1, 0, current);
        // The new `lastDeletionIndex` may be out of range, but `splice` will fix it
        return [result, current, lastDeletionIndex + 2];
      }

      result.push(current);

      // Keep the `lastDeletionIndex` if there are lines of deletions,
      // otherwise update it to the new deletion line
      const newLastDeletionIndex = current.isDelete
        ? last.isDelete
          ? lastDeletionIndex
          : i
        : i;

      return [result, current, newLastDeletionIndex];
    },
    [[], null, -1]
  );
  return result;
};

const mapHunk = (hunk, options) => {
  const changes =
    options.nearbySequences === "zip" ? zipChanges(hunk.changes) : hunk.changes;

  return {
    ...hunk,
    isPlain: false,
    changes: changes,
  };
};

const mapFile = (file, options) => {
  const hunks = file.chunks.map((hunk) => mapHunk(hunk, options));

  return { ...file, hunks };
};
