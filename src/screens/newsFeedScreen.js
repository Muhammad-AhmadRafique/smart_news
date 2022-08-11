import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  ActivityIndicator,
  Text,
  MD2Colors,
  Subheading,
} from "react-native-paper";
import styled from "styled-components";
import NewsFeedItem from "../components/news.feeds.component";
import Search from "../components/search.component";
import { Spacer } from "../components/spacer.component";
import { SafeArea } from "../components/utility/safe.area.component";

const TopContainer = styled(View)`
  margin: 30px;
  margin-top: 40px;
`;
const Heading = styled(Text)`
  font-family: "Oswald_700Bold";
  font-size: 50;
`;
const SubHeading = styled(Text)`
  font-family: "Lato_700Bold";
  font-size: 15;
  color: ${(props) => props.theme.colors.text.disabled};
`;
function NewsFeedScreen(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState([
    { id: 1, name: "" },
    { id: 2, name: "" },
    { id: 3, name: "" },
    { id: 4, name: "" },
    { id: 5, name: "" },
    { id: 6, name: "" },
  ]);

  const apiKey = "60452f97691747c58b9d9153e47feae3";
  const getHeadlines = () => {
    //newsapi.org/v2/top-headlines?country=us&apiKey=60452f97691747c58b9d9153e47feae3
    setIsLoading(true);
    const url =
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=" + apiKey;
    https: return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json.articles);
        setIsLoading(false);
        setNewsList(json.articles);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   getHeadlines();
  // }, []);

  return (
    <SafeArea>
      <TopContainer>
        <Heading>Discover</Heading>
        <SubHeading>News from all over the world</SubHeading>
      </TopContainer>
      <Search />
      <Spacer position="bottom" size="large"></Spacer>
      <FlatList
        data={newsList}
        renderItem={({ item }) => (
          <Spacer position="bottom" size="large">
            <NewsFeedItem />
          </Spacer>
        )}
      />
    </SafeArea>
  );
}

export default NewsFeedScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    margin: 30,
    marginTop: 40,
  },
});
