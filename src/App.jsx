import { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { ReactComponent as Star } from "./assets/star.svg";
import { ReactComponent as Issue } from "./assets/issue.svg";
import { ReactComponent as Repo } from "./assets/repo.svg";
import { ReactComponent as Fork } from "./assets/fork.svg";
import { ReactComponent as Contributors } from "./assets/contributors.svg";

const hexToRgb = (hexColor) => {
  let r, g, b;
  // convert 3-digit hex to 6-digits.
  if (hexColor.length === 3) {
    hexColor =
      hexColor[0] +
      hexColor[0] +
      hexColor[1] +
      hexColor[1] +
      hexColor[2] +
      hexColor[2];
  }
  r = parseInt(hexColor.slice(0, 2), 16);
  g = parseInt(hexColor.slice(2, 4), 16);
  b = parseInt(hexColor.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
};
const invertRgb = (rgbColor) => {
  let r, g, b, rgb;
  rgb = rgbColor.split(" ");
  r = rgb[0];
  g = rgb[1];
  b = rgb[2];
  console.log(r * 0.299 + g * 0.587 + b * 0.114);
  // https://stackoverflow.com/a/3943023/112731
  // return r * 0.299 + g * 0.587 + b * 0.114 > 186
  //   ? "000 000 000"
  //   : "255 255 255";

  r = 255 - rgbColor.slice(0, 2);
  g = 255 - rgbColor.slice(2, 4);
  b = 255 - rgbColor.slice(4, 6);
  return `${r} ${g} ${b}`;
};
function App() {
  const [data, setData] = useState({
    repository: {
      stargazerCount: 0,
      openedIssues: { totalCount: 0 },
      forks: { totalCount: 0 },
      contributors: { totalCount: 0 },
      goodFirstIssues: { totalCount: 0 },
      backendIssues: { totalCount: 0 },
      frontEndIssues: { totalCount: 0 },
      microcontrollersIssues: { totalCount: 0 },
      goodFirstIssueLabel: { color: "", description: "" },
      MicrocontrollersLabel: {
        color: "",
        description: "",
      },
      FrontendLabel: { color: "", description: "" },
      BackendLabel: { color: "", description: "" },
    },
  });
  useEffect(() => {
    const document = gql`
      query ($last: Int, $owner: String!, $repoName: String!) {
        repository(owner: $owner, name: $repoName) {
          stargazerCount

          openedIssues: issues(last: $last, states: OPEN) {
            totalCount
          }

          goodFirstIssues: issues(last: $last, labels: ["good first issue"]) {
            totalCount
          }

          backendIssues: issues(last: $last, labels: ["Backend"]) {
            totalCount
          }

          frontEndIssues: issues(last: $last, labels: ["Frontend"]) {
            totalCount
          }

          microcontrollersIssues: issues(
            last: $last
            labels: ["Microcontrollers"]
          ) {
            totalCount
          }
          goodFirstIssueLabel: label(name: "good first issue") {
            color
            description
          }
          MicrocontrollersLabel: label(name: "Microcontrollers") {
            color
            description
          }
          FrontendLabel: label(name: "Frontend") {
            color
            description
          }
          BackendLabel: label(name: "Backend") {
            color
            description
          }
          forks: forks(last: $last) {
            totalCount
          }
          contributors: collaborators {
            totalCount
          }
        }
      }
    `;
    const url = "https://api.github.com/graphql";
    const variables = {
      last: 100,
      owner: "ahmadghoniem",
      repoName: "serialSocket",
    };
    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: "bearer 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",
    };
    request({
      url,
      document,
      variables,
      requestHeaders,
    }).then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);
  // buckleUp destrcturing..

  const {
    stargazerCount,
    openedIssues: { totalCount: openedIssuesCount },
    forks: { totalCount: forksCount },
    contributors: { totalCount: contributorsCount },
    goodFirstIssues: { totalCount: goodFirstIssuesCount },
    backendIssues: { totalCount: backendIssuesCount },
    frontEndIssues: { totalCount: frontEndIssuesCount },
    microcontrollersIssues: { totalCount: microcontrollersIssuesCount },
    goodFirstIssueLabel: {
      color: goodFirstIssueIssueLabelColor,
      description: goodFirstIssueLabelDesc,
    },
    MicrocontrollersLabel: {
      color: MicrocontrollersIssueLabelColor,
      description: MicrocontrollersLabelDesc,
    },
    FrontendLabel: {
      color: FrontendIssueLabelColor,
      description: FrontendLabelDesc,
    },
    BackendLabel: {
      color: BackendIssueLabelColor,
      description: BackendLabelDesc,
    },
  } = data.repository;

  document
    .querySelector(":root")
    .style.setProperty(
      "--good-first-issue-label-color",
      hexToRgb(goodFirstIssueIssueLabelColor),
    );
  document
    .querySelector(":root")
    .style.setProperty(
      "--frontend-issue-label-color",
      hexToRgb(FrontendIssueLabelColor),
    );
  document
    .querySelector(":root")
    .style.setProperty(
      "--backend-issue-label-color",
      hexToRgb(BackendIssueLabelColor),
    );
  document
    .querySelector(":root")
    .style.setProperty(
      "--microcontrollers-issue-label-color",
      hexToRgb(MicrocontrollersIssueLabelColor),
    );
  // for inverted colors
  document
    .querySelector(":root")
    .style.setProperty(
      "--gfx",
      invertRgb(hexToRgb(goodFirstIssueIssueLabelColor)),
    );
  document
    .querySelector(":root")
    .style.setProperty("--fex", invertRgb(hexToRgb(FrontendIssueLabelColor)));
  document
    .querySelector(":root")
    .style.setProperty("--bex", invertRgb(hexToRgb(BackendIssueLabelColor)));
  document
    .querySelector(":root")
    .style.setProperty(
      "--mcx",
      invertRgb(hexToRgb(MicrocontrollersIssueLabelColor)),
    );

  return (
    <div className=" p-4">
      <p>
        <Repo className="inline" />
        SerialSocket
      </p>
      <p>
        <Star className="inline" /> {stargazerCount} stargazers✨
      </p>
      <p>
        <Contributors className="inline" /> {contributorsCount}
        contributorsCount
      </p>

      <p>
        <Fork className="inline" /> {forksCount} forksCount
      </p>
      <p>
        <Issue className="inline" /> {openedIssuesCount} openedIssuesCount
      </p>

      <p>
        {goodFirstIssuesCount}x
        <button className="rounded-full border border-goodFirstIssue-border bg-goodFirstIssue px-6 py-3 font-bold text-goodFirstIssue-foreground transition-colors duration-500">
          <span className="text-goodFirstIssue-foreground">
            Good first issue
          </span>
        </button>
      </p>
      <p>
        {backendIssuesCount}x
        <button className="rounded-full border border-backend-border bg-backend px-6 py-3 font-bold text-backend-foreground transition-colors duration-500">
          <span className="text-backend-foreground">Backend</span>
        </button>
      </p>
      <p>
        {frontEndIssuesCount}x
        <button className="rounded-full border border-frontend-border bg-frontend px-6 py-3 font-bold text-frontend-foreground transition-colors duration-500">
          <span className="text-frontend-foreground">Frontend</span>
        </button>
      </p>
      <p>
        {microcontrollersIssuesCount}x
        <button className="rounded-full border border-microcontrollers-border bg-microcontrollers px-6 py-3 font-bold text-microcontrollers-foreground transition-colors duration-500">
          <span className="text-microcontrollers-foreground">
            Microcontroller
          </span>
        </button>
      </p>

      <button onClick={() => document.documentElement.classList.toggle("dark")}>
        toggle dark mode
      </button>
    </div>
  );
}

export default App;
