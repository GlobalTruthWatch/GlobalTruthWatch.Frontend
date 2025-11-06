import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private selectedArticle: any = null;
  private allArticles: any[] = [];

  setArticle(article: any) {
    this.selectedArticle = article;
  }

  getArticle() {
    return this.selectedArticle;
  }

  setAllArticles(articles: any[]) {
    this.allArticles = articles;
  }

  getAllArticles() {
    return this.allArticles;
  }
}
