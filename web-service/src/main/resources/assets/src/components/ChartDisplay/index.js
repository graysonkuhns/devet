import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Typography, Slide, Card, CardContent, CircularProgress } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Search from '../Search';
import Title from '../Title';
import ProfileInfo from '../ProfileInfo'
import { makeStyles } from '@material-ui/core/styles';
import "chart.js";
import { PieChart } from 'react-chartkick';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1
    },
    paper: {
        margin: "3rem",
        padding: "3rem",
        backgroundColor: "#efefef"
    },
    title: {
        fontSize: "6vw",
        marginBottom: ".5rem"
    },
    card: {
        paddingTop: "2rem",
        paddingBottom: "3rem"
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    searchBar: {
        marginTop: "2rem"
    },
    profile: {
        marginTop: '.5rem'
    }

}));

/**
 * @typedef {Object} ChartDisplayProps
 * @property {any} data 
 * @property {(username: string) => void} handleSearch
 */

/**
 * @param {ChartDisplayProps} props
 */
function ChartDisplay(props) {
    const classes = useStyles();

    const [freezeData, setFreezeData] = useState(false);
    const [data1, setData1] = useState();
    const [data2, setData2] = useState();
    const [oldProps, setOldProps] = useState();
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (oldProps != props) {
            updateData();
        }
    });

    function updateData() {
        if (props.data && !freezeData) {
            {
                setClicked(false);

                // Handle repository languages
                const langs = props.data.repositoryLanguages;
                const newData = Object.keys(langs).map(key => [key, langs[key]]);

                /** @type {number[][]} */
                const oldData = data1;

                if (oldData) {
                    newData.forEach(d => {
                        // If the language already exists
                        const oldLang = oldData.find(lang => lang[0] == d[0]);
                        if (oldLang) {
                            oldLang[1] = d[1];
                        } else {
                            oldData.push(d);
                        }
                    });

                    setData1(oldData);
                } else {
                    setData1(newData);
                }
            }

            {
                // Handle commit languages
                const langs = props.data.commitLanguages;
                const newData = Object.keys(langs).map(key => [key, langs[key]]);

                /** @type {number[][]} */
                const oldData = data2;

                if (!oldData) {
                    setData2(newData);
                } else {
                    newData.forEach(d => {
                        // If the language already exists
                        const oldLang = oldData.find(lang => lang[0] == d[0]);
                        if (oldLang) {
                            oldLang[1] = d[1];
                        } else {
                            oldData.push(d);
                        }
                    });

                    setData2(oldData);
                }
            }

            setOldProps(props);
        }
    }

    /**
     * @param {string} username
     */
    function handleSearch(username) {
        setClicked(true);
        console.log("test7");
        if (props.data) {
            setFreezeData(true);
            setTimeout(() => {
                //setData1(undefined);
                setData2(undefined);
                setOldProps(null);
                setFreezeData(false);
                updateData();
            }, 1000);
        }

        props.handleSearch(username);
    }

    let user = props.user;
    return (
        <Paper className={classes.paper}>
            <Grid justify="center" container>
                <Grid item>
                    <Typography className={classes.title} variant="h1">Welcome to DeVet</Typography>
                </Grid>
            </Grid>
            <Grid justify="center" container>
                <Grid item>
                    <Search handleSearch={handleSearch} className={classes.searchBar} />
                </Grid>
            </Grid>
            {
                oldProps ?
                    <Slide in={oldProps && oldProps.data && !freezeData} timeout={1000} direction="up">
                        <Grid justify="center" container spacing={3}>
                            <ProfileInfo
                                className={classes.profile} name={user.name} avatarUrl={user.avatar_url} bio={user.bio} />
                            <Grid item xs={12} md={12} lg={6}>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Title>Owned Repositories</Title>
                                        <PieChart data={data1} />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={12} lg={6}>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Title>Contributed Code</Title>
                                        <PieChart data={data2} />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={12} lg={6}>
                                <Paper>
                                    {
                                        props.data.topRepositories.map((repo, i) => {
                                            return (
                                                <Title key={i++}>repo.name</Title>
                                            )
                                        })
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Slide>
                    :
                    (
                        clicked &&
                        <Grid container justify="center">
                            <CircularProgress />
                        </Grid>
                    )
            }
        </Paper>
    );
}

export default ChartDisplay;