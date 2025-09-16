import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './database.html',
  styleUrls: ['./database.css']
})
export class Database implements OnInit {
  FontAwesome = fontawesome;
  categoryQuery: string | null = null;
  searchQuery: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoryQuery = params.get('category');
      console.log('Category query:', this.categoryQuery);
      this.searchQuery = params.get('search');
      console.log('Search query:', this.searchQuery);
    });
  }

  updateCategory(query: string): void {
    this.router.navigate([], {
      queryParams: { category: query },
      queryParamsHandling: 'merge',
    });
  }

  updateSearch(query: string): void {
    this.router.navigate([], {
      queryParams: { search: query },
      queryParamsHandling: 'merge',
    });
  }
}
