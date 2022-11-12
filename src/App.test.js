import { act, render, screen } from "@testing-library/react";

import App from "./App";
import axios from "axios";
import userEvent from "@testing-library/user-event";

const fetchData = async () =>
  await axios
    .get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=Starboy&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    )
    .then(({ data }) => data)
    .catch(({ response }) => console.log(response.data));

describe("<App />", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<App />);

    const SearchInput = screen.getByPlaceholderText("Search");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.type(SearchInput, "Starboy");
      userEvent.click(screen.getByRole("button"));
    });
  });

  it("Should render loading spinner on searching videos", () => {
    expect(screen.getByTitle("spinner")).toBeInTheDocument();
  });

  it("Should render main content area after search", async () => {
    expect(await screen.findByTestId("main-content-area")).toBeInTheDocument();
  });

  it("Should render list of videos at the side bar", async () => {
    const data = await fetchData();

    const elementsLength = await screen
      .findAllByTestId("sidebar-content-area")
      .then((data) => data.length);

    console.log(elementsLength, data.length);

    expect(elementsLength).toEqual(data.items.length);
  });

  it("First video from the search list should be selected", async () => {
    const data = await fetchData();
    const videoData = data.items[0];

    expect(await screen.findByTitle("YouTube video player")).toHaveAttribute(
      "src",
      `https://www.youtube.com/embed/${videoData.id.videoId}`
    );
    expect(
      (await screen.findAllByText(videoData.snippet.title)).length
    ).toEqual(2);
  });

  it("Should select second video from the side bar", async () => {
    const data = await fetchData();
    const videoData = data.items[1];

    const imgElement = screen.getByAltText(`${videoData.snippet.title}_img`);
    userEvent.click(imgElement);

    expect(await screen.findByTitle("YouTube video player")).toHaveAttribute(
      "src",
      `https://www.youtube.com/embed/${videoData.id.videoId}`
    );
    expect(
      (await screen.findAllByText(videoData.snippet.title)).length
    ).toEqual(2);
  });
});
