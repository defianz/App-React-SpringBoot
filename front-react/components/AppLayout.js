import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import Link from "next/Link"
import { Menu, Input, Row, Col } from 'antd'
import styled from "styled-components";
import LoginForm from "../pages/LoginForm";
import UserProfile from "../components/UserProfile"
import {useSelector} from "react-redux";
import useinput from "../hooks/useinput";
import {Router} from "next/router";

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`

const AppLayout = ({children}) => {
    const [searchInput, onChangeSearchInput] = useinput("");
    const { me } = useSelector((state) => state.user);
    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`);
    },[searchInput])

    return (
        <div>
            <Menu mode={"horizontal"}>
                <Menu.Item>
                    <Link href="/"><a>Defian Tweeter</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput
                        enterButton
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                        />
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup">
                        <a>회원가입</a>
                    </Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a
                        href="https://github.com/defianz"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        made by Defian
                    </a>
                </Col>
            </Row>
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default AppLayout;