import { Interface } from '@libs/application';
import { ArticleList } from '@libs/application/article';
import { ArticleListHandler } from '@libs/application/article/queries';
import { inject } from 'njct';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';

import { HomeView } from './HomeView';

export function Home(props: RouteComponentProps): JSX.Element {
    const articleService = inject<Interface.ArticleService>('articleservice');
    const { data: articleList, error } = useSWR<ArticleList>('home/articles', () => {
        const query = new ArticleListHandler(articleService);
        return query.execute();
    });

    if (error) {
        return <p>{error}</p>;
    }

    return <HomeView articles={articleList?.articles} />;
}
