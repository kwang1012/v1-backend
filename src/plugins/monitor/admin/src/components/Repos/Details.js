import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { request } from "@strapi/helper-plugin";
import {
  Box,
  Card,
  Typography,
  Flex,
  Button,
  TextButton,
} from "@strapi/design-system";
import { parsePatch } from "../../utils/parse";
import { Diff, Hunk, tokenize } from "react-diff-view";
import * as refractor from "refractor";
import "react-diff-view/style/index.css";
import "prism-themes/themes/prism-vs.css";

const ButtonGroup = styled(Box)`
  border: 1px solid #eaeaef;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  & button {
    border-top: none;
    border-bottom: none;
    border-right: 1px solid #eaeaef;
    border-radius: 0;
    &.selected {
      background: hsla(220, 14%, 94%, 1);
    }
  }
  & > *:first-child button {
    border-left: none;
  }
  & > *:last-child button,
  & > *:last-child {
    border-right: none;
  }
`;

const Avatar = styled("img")`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
`;

export default function Detail() {
  const [commit, setCommit] = useState();
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("unified");

  const { sha } = useParams();

  useEffect(() => {
    request(`/monitor/github/commit/${sha}`)
      .then((data) => {
        setCommit(data);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (!commit) return;
    const files = commit.files.map((file) => ({
      filename: file.filename,
      ...parsePatch(file.patch),
    }));
    files.forEach((file) => {
      if (!file.hunks) {
        return;
      }

      const options = {
        refractor,
        highlight: true,
        language: "javascript",
      };

      try {
        file.tokens = tokenize(file.hunks, options);
      } catch (ex) {
        return;
      }
    });
    setFiles(files);
  }, [commit]);

  const renderFile = ({ hunks, tokens, filename }, i) => (
    <Card marginTop={4} key={"file" + i}>
      <Flex
        padding={3}
        style={{ borderBottom: "1px #eaeaef solid", background: "#f6f8fa" }}
      >
        <Typography>{filename}</Typography>
      </Flex>
      <Diff viewType={mode} diffType={"modify"} hunks={hunks} tokens={tokens}>
        {(hunks) =>
          hunks.map((hunk, hid) => (
            <Hunk key={"file" + i + "hunk" + hid} hunk={hunk} />
          ))
        }
      </Diff>
    </Card>
  );

  return (
    <>
      {commit && (
        <>
          <Card marginTop={4}>
            <Flex
              padding={3}
              style={{
                borderBottom: "1px #eaeaef solid",
                background: "#f6f8fa",
              }}
            >
              <Typography variant="delta">{commit.commit.message}</Typography>
            </Flex>
            <Flex marginTop={1} padding={2} justifyContent="space-between">
              <Flex>
                <Avatar
                  src={commit.committer.avatar_url}
                  alt="avatar"
                  preview
                />
                <TextButton marginRight={1}>
                  <Typography variant="pi" fontWeight="bold">
                    {commit.committer.login}
                  </Typography>
                </TextButton>
                <Typography variant="pi" textColor="neutral500">
                  committed 3 hours ago
                </Typography>
              </Flex>
              <Flex alignItems="center">
                <Flex marginRight={2}>
                  <Typography variant="pi">commit</Typography>
                </Flex>
                <Typography variant="pi">{commit.sha}</Typography>
              </Flex>
            </Flex>
          </Card>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginTop={4}
          >
            <Typography>
              Showing{" "}
              <Typography fontWeight="bold">
                {commit.files.length} changed file
              </Typography>{" "}
              with{" "}
              <Typography fontWeight="bold">
                {commit.stats.additions} additions
              </Typography>
              and{" "}
              <Typography fontWeight="bold">
                {commit.stats.deletions} deletions.
              </Typography>
            </Typography>
            <ButtonGroup>
              <Button
                variant="ghost"
                className={[mode === "split" ? "selected" : ""].join(" ")}
                onClick={() => setMode("split")}
              >
                Split
              </Button>
              <Button
                variant="ghost"
                className={[mode === "unified" ? "selected" : ""].join(" ")}
                onClick={() => setMode("unified")}
              >
                Unified
              </Button>
            </ButtonGroup>
          </Flex>
          {files.map(renderFile)}
        </>
      )}
    </>
  );
}
