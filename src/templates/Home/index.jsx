import './styles.css';
import { Component } from 'react';
import { Posts } from '../../components/Posts'
import { loadPosts } from '../../utils/load-posts'
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postPerPage: 6,
    searchValue: '',

  };


  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postPerPage } = this.state;
    const postAndPhotos = await loadPosts();
    this.setState({
      posts: postAndPhotos.slice(page, postPerPage),
      allPosts: postAndPhotos,
    });
  }

  loadMorePosts = () => {
    const {
      page,
      postPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });

    console.log('Load more posts chamado');
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  render() {
    const { posts, page, postPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postPerPage >= allPosts.length;

    const filteredPosts = !!searchValue ?
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(
          searchValue.toLocaleLowerCase()
        );
      })
      : posts;

    return (
      <section className='container'>
        <div className="search-container">


          {!!searchValue && (
            <>
              <h1>Search value: {searchValue} </h1> <br /> <br />
            </>

          )}

          <TextInput searchValue={searchValue}
            handleChange={this.handleChange} />
        </div>


        {filteredPosts.length === 0 && (
          <p>Não existem posts</p>
        )}
        <Posts posts={filteredPosts} />

        <div className="button-container">
          {!searchValue && (
            <Button
              disabled={noMorePosts}
              text={'Load more posts'}
              onClick={this.loadMorePosts}
            />
          )}

        </div>

      </section >
    );
  }
}

