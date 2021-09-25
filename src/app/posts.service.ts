import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { post } from './post.model';
import {map, catchError} from 'rxjs/operators'
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  creatAndStorePost(title: string, content: string) {
    // Send Http request
    const postData: post = {title: title, content: content};
    this.http.post<{name: string}>(
     'https://http-complete-guide-9d355-default-rtdb.firebaseio.com/posts.json', 
     postData
     ).subscribe(responseData => {
       console.log(responseData);
     }, error => {
        this.error.next(error.message)
     }
    );
 }

 fetchPost() {
  return this.http
    .get<{[key: string]: post}>(
     'https://http-complete-guide-9d355-default-rtdb.firebaseio.com/posts.json'
     )
    .pipe(
      map(responseData => {
        const postsArray: post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key})
        }
      }
      return postsArray;
    }),
    catchError(errorRes => {
      return throwError(errorRes);
    })
  );
  
 }


 deletePost() {
  return this.http.delete('https://http-complete-guide-9d355-default-rtdb.firebaseio.com/posts.json');
 }
}
