import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  Box,
  Typography,
  Card,
  Flex,
  IconButton,
  TextButton,
  Button,
  Select,
  Option,
} from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { Code } from "@strapi/icons";
import moment from "moment";
import Copy from "./components/Copy";

const CardGroup = styled(Box)`
  & > article {
    border-left: none;
    border-right: none;
    box-shadow: none;
    border-radius: 0;
    &:hover {
      background: #f6f8fa;
    }
  }
  & > article:not(first-child) {
    border-top: none;
  }
  & > article:last-child {
    border-bottom: none;
  }
  overflow: hidden;
  border: 1px solid #eaeaef;
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgb(33 33 52 / 10%);
`;

const Avatar = styled("img")`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
`;

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
  }
  & > *:first-child button {
    border-left: none;
  }
  & > *:last-child button,
  & > *:last-child {
    border-right: none;
  }
`;

export default function CommitList() {
  const history = useHistory();
  const [timelineObj, setTimelineObj] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    request("/monitor/github/branches").then((data) => {
      setBranches(data);
      setSelectedBranch(data[0]?.name || "");
    });
    request("/monitor/github/commits").then((commits) => {
      const tmp = {};
      commits.forEach((commit) => {
        const date = moment(commit.commit.committer.date).format("YYYY-MM-DD");
        if (tmp[date]) {
          tmp[date].push(commit);
        } else {
          tmp[date] = [commit];
        }
      });
      setTimelineObj(tmp);
    });
  }, []);

  return (
    <>
      <Box width="100px">
        <Select value={selectedBranch}>
          {branches.map((branch) => (
            <Option key={branch.name} value={branch.name}>
              {branch.name}
            </Option>
          ))}
        </Select>
      </Box>
      <Box marginTop={6}>
        {Object.entries(timelineObj).map(([key, commits]) => (
          <Box key={key}>
            <Box marginTop={4} marginBottom={4}>
              <Typography
                variant="delta"
                textColor="neutral500"
                fontWeight="regular"
              >
                Commits on {key}
              </Typography>
            </Box>
            <CardGroup margin="16px 0">
              {commits.map((commit, cid) => (
                <Card key={cid} padding="8px 16px">
                  <Flex justifyContent="space-between">
                    <Box>
                      <Typography fontWeight="bold">
                        {commit.commit.message}
                      </Typography>
                      <Flex marginTop={1}>
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
                    </Box>
                    <Flex>
                      <ButtonGroup marginRight={2}>
                        <IconButton icon={<Copy />} label="Copy the full sha" />
                        <Button
                          variant="ghost"
                          onClick={() =>
                            history.push({
                              pathname: `/plugins/monitor/repos/${commit.sha}`,
                            })
                          }
                        >
                          <Box
                            width="50px"
                            style={{ justifyContent: "center" }}
                          >
                            {commit.sha.slice(0, 7)}
                          </Box>
                        </Button>
                      </ButtonGroup>
                      <IconButton
                        icon={<Code />}
                        label="Browse the repository at this point in the history"
                      />
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </CardGroup>
          </Box>
        ))}
      </Box>
    </>
  );
}
