import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import styled from "styled-components";
import HeadlineFeedsComponent from "../components/headline.feeds.component";
import NewsFeedItem from "../components/news.feeds.component";
import Search from "../components/search.component";
import { Spacer } from "../components/spacer.component";
import { SafeArea } from "../components/utility/safe.area.component";
import { ApiUrls, apiUrls, AppConstants } from "../constants/app.constants";
import { colors } from "../infrastructure/theme/colors";
import {
  CellHeading,
  CellSubHeading,
  MediumHeading,
} from "../infrastructure/theme/global.styles";

import DetailScreen from "./detailScreen";
const imagePlaceholder = require("../../assets/news-placeholder.png")

const ImageContainer = styled(View)`
  height: 50%;
  /* position: "absolute"; */
`;
const LoadingContainer = styled(View)`
  position: absolute;
  top: 50%;
  /* bottom: 50px; */
  left: 50%;
  margin-left: -25px;
  margin-top: 50px;
`;

function NewsFeedScreen(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [headlineData, setHeadlineData] = useState({ urlToImage: require("../../assets/news-placeholder.png"), title: "" })
  const [headline, setHeadline] = useState(false)

  const getUrl = () => {
    if (searchKeyword === "") {
      const url =
        AppConstants.baseURL +
        ApiUrls.topHeadlines +
        "?category=business" +
        "&country=us" +
        "&pageSize=100" +
        "&page=" +
        page +
        "&apiKey=" +
        AppConstants.apiKey;

      return url;
    } else {
      const url =
        AppConstants.baseURL +
        ApiUrls.topHeadlines +
        "?category=business" +
        "&country=us" +
        "&pageSize=100" +
        "&page=" +
        page +
        "&q=" +
        searchKeyword +
        "&apiKey=" +
        AppConstants.apiKey;

      return url;
    }
  };

  useEffect(() => {
    if (headline) {
      setHeadline(false)
    }
  }, [headline])

  const getHeadlines = () => {
    setIsLoading(true);
    console.log(getUrl());
    return fetch(getUrl())
      .then((response) => response.json())
      .then((json) => {
        // console.log(json.articles);
        setIsLoading(false);

        let list = json.articles;
        let status = json["status"];

        if (status === "ok") {
          if (list === []) {
            setIsListEnd(true);
          } else {
            setIsListEnd(false);
            setNewsList([...newsList, ...list]);
            setHeadlineData({
              urlToImage: list[0].urlToImage,
              title: list[0].title
            })
            setHeadline(true)
          }
        } else {
          setIsListEnd(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isListEnd === false) {
      getHeadlines();
    }
  }, [searchKeyword, page]);

  const reset = () => {
    setIsLoading(true);
    setNewsList([]);
    setPage(1);
    setIsListEnd(false);
  };

  const navigateToDetailScreen = (item) => {
    const { navigation } = props
    navigation.push('Details', { item })
  }

  return (
    <SafeArea>
      <ImageContainer>
        <ImageBackground
          source={{
            // uri: "https://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F0812%2Fr1047370_1296x729_16%2D9.jpg",
            // uri: newsList[0].urlToImage,
            uri: headlineData.urlToImage == null ? require("../../assets/news-placeholder.png") : headlineData.urlToImage
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
          imageStyle={{
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                opacity: 0.7,
                alignItems: "center",
                height: 40,
                width: 150,
                borderRadius: 20,
                left: 30,
              }}
            >
              <CellSubHeading
                style={{
                  textAlign: "center",
                  fontFamily: "Lato_700Bold",
                  fontSize: 15,
                  color: "#333333",
                }}
              >
                News of the day
              </CellSubHeading>
            </View>
            <CellHeading
              style={{
                color: "white",
                fontSize: 25,
                fontFamily: "Lato_700Bold",
                textAlign: "left",
                margin: 30,
                marginBottom: 50,
              }}
            >
              {/* `${newsList[0].title}` */}
              {headlineData.title}
            </CellHeading>
          </View>
        </ImageBackground>
      </ImageContainer>
      <MediumHeading style={styles.headline}>Breaking News</MediumHeading>
      {isLoading && (
        <LoadingContainer>
          <ActivityIndicator
            animating={true}
            size={50}
            color={colors.brand.secondary}
          />
        </LoadingContainer>
      )}
      <FlatList
        style={styles.listing}
        horizontal
        data={newsList}
        renderItem={({ item }) => (
          <Spacer position="right" size="large">
            <TouchableOpacity
              style={{
                height: "100%"
              }}
              onPress={() => {
                navigateToDetailScreen(item);
              }}
            >
              <HeadlineFeedsComponent item={item} />
            </TouchableOpacity>
          </Spacer>
        )}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          setPage(page + 1);
        }}
      />
    </SafeArea>
  );
}

export default NewsFeedScreen;

const styles = StyleSheet.create({
  headline: {
    margin: 20,
  },
  listing: {
    marginLeft: 20,
  },
});
