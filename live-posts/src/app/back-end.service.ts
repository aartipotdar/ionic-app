import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';

/*
  Database path
  https://live-posts-78d4b-default-rtdb.firebaseio.com/
*/

@Injectable({ providedIn: 'root' })
export class BackEndService {
  constructor(private postService: PostService, private http: HttpClient) {}

  //Function Save
  saveData() {
    //Step-1 - get list of posts from post.service
    const listOfPosts: Post[] = this.postService.getPosts();

    //Step-2 - send list of posts to backend(save to database)
    this.http
      .put(
        'https://live-posts-78d4b-default-rtdb.firebaseio.com/posts.json',
        listOfPosts
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  //Function fetch
  fetchData() {
    //Step-1 get posts from database
    this.http
      .get<Post[]>(
        'https://live-posts-78d4b-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        tap((listOfPosts: Post[]) => {
          console.log(listOfPosts);

          //Step-2 Send to post.service
          this.postService.setPost(listOfPosts);
        })
      )
      .subscribe();
  }
}
