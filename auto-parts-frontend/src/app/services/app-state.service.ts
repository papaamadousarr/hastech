import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, SubCategory } from './product.service';

export interface AppState {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubcategory: SubCategory | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private initialState: AppState = {
    categories: [],
    selectedCategory: null,
    selectedSubcategory: null,
    loading: false,
    error: null
  };

  private state = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.state.asObservable();

  constructor() {}

  // Méthodes pour mettre à jour l'état
  setLoading(loading: boolean) {
    this.updateState({ loading });
  }

  setError(error: string | null) {
    this.updateState({ error });
  }

  setCategories(categories: Category[]) {
    this.updateState({ categories });
  }

  setSelectedCategory(category: Category | null) {
    this.updateState({ selectedCategory: category });
  }

  setSelectedSubcategory(subcategory: SubCategory | null) {
    this.updateState({ selectedSubcategory: subcategory });
  }

  // Méthode utilitaire pour mettre à jour l'état
  private updateState(partial: Partial<AppState>) {
    this.state.next({ ...this.state.value, ...partial });
  }

  // Méthodes pour récupérer l'état actuel
  getCurrentState(): AppState {
    return this.state.value;
  }

  getCategories(): Observable<Category[]> {
    return new Observable(observer => {
      this.state$.subscribe(state => {
        observer.next(state.categories);
      });
    });
  }

  getSelectedCategory(): Observable<Category | null> {
    return new Observable(observer => {
      this.state$.subscribe(state => {
        observer.next(state.selectedCategory);
      });
    });
  }

  getLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.state$.subscribe(state => {
        observer.next(state.loading);
      });
    });
  }

  getError(): Observable<string | null> {
    return new Observable(observer => {
      this.state$.subscribe(state => {
        observer.next(state.error);
      });
    });
  }

  // Méthode pour réinitialiser l'état
  reset() {
    this.state.next(this.initialState);
  }
} 