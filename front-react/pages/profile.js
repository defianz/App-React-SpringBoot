import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";

import AppLayout from "../../../../Downloads/react-nodebird-master/front/components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../../../../Downloads/react-nodebird-master/front/components/FollowList";
import Router from "next/router";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../../../../Downloads/react-nodebird-master/front/reducers/user";

import { LOAD_POSTS_REQUEST } from "../../../../Downloads/react-nodebird-master/front/reducers/post";

import wrapper from "../../../../Downloads/react-nodebird-master/front/store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { backUrl } from "../../../../Downloads/react-nodebird-master/front/config/config";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `${backUrl}/user/followers?limit=${followersLimit}`,
    fetcher
  );

  const { data: followingsData, error: followingError } = useSWR(
    `${backUrl}/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   }),
  //     dispatch({
  //       type: LOAD_FOLLOWINGS_REQUEST,
  //     });
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return "??? ?????? ?????????";
  }

  if (followerError || followingError) {
    console.error(followingError || followerError);
    return "?????????/????????? ?????? ??? ????????? ???????????????.";
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>??? ????????? | Nodebird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="?????????"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="?????????"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
  );
};

// Home.getInitialProps; ??????????????????
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps Start");
    console.log(context.req.headers);
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    console.log("context???");
    console.log(context);
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise();
  }
);

export default Profile;
