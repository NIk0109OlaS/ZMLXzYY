// 代码生成时间: 2025-09-28 20:02:59
 * It's designed to be a starting point for developing more complex
 * recommendation systems.
 */

import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

// Define a type for User, Item, and Recommendation
type User = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  title: string;
  genre: string;
};

type Recommendation = {
  user: User;
  item: Item;
  score: number;
};

// Define a simple recommendation system class
class RecommendationSystem {
  private itemDatabase: Item[];
  private userDatabase: User[];
  private userScores: Map<number, Map<number, number>>;

  constructor() {
    this.itemDatabase = [];
    this.userDatabase = [];
    this.userScores = new Map();
  }

  // Add a user to the system
  add_user(user: User): void {
    this.userDatabase.push(user);
    this.userScores.set(user.id, new Map());
  }

  // Add an item to the system
  add_item(item: Item): void {
    this.itemDatabase.push(item);
  }

  // Add a score for an item by a user
  add_user_score(user_id: number, item_id: number, score: number): void {
    let user_scores = this.userScores.get(user_id);
    if (!user_scores) {
      throw new Error('User does not exist in the system.');
    }
    user_scores.set(item_id, score);
  }

  // Generate a recommendation for a user
  recommend(user_id: number): Recommendation[] {
    let user_scores = this.userScores.get(user_id);
    if (!user_scores) {
      throw new Error('User does not exist in the system.');
    }
    let recommendations: Recommendation[] = [];
    for (let item of this.itemDatabase) {
      if (!user_scores.has(item.id)) { // Avoid recommending items already scored
        let score = this.calculate_item_score(user_id, item.id);
        if (score > 0) { // Only recommend items with positive scores
          recommendations.push({ user: this.find_user_by_id(user_id), item, score });
        }
      }
    }
    return recommendations;
  }

  // Calculate the score for an item based on user preferences
  private calculate_item_score(user_id: number, item_id: number): number {
    let user_scores = this.userScores.get(user_id);
    if (!user_scores) {
      throw new Error('User does not exist in the system.');
    }
    let user_preferences = this.calculate_user_preferences(user_id);
    let item_features = this.get_item_features(item_id);
    let score = 0;
    for (let feature in user_preferences) {
      if (item_features[feature] !== undefined) {
        score += user_preferences[feature] * item_features[feature];
      }
    }
    return score;
  }

  // Calculate user preferences based on their item scores
  private calculate_user_preferences(user_id: number): { [key: string]: number } {
    let user_scores = this.userScores.get(user_id);
    if (!user_scores) {
      throw new Error('User does not exist in the system.');
    }
    let total_scores = Array.from(user_scores.values()).reduce((a, b) => a + b, 0);
    let preferences: { [key: string]: number } = {};
    for (let [item_id, score] of user_scores) {
      let item = this.find_item_by_id(item_id);
      if (item) {
        for (let feature in item) {
          if (feature !== 'id' && feature !== 'title') {
            preferences[feature] = (preferences[feature] || 0) + score * item[feature];
          }
        }
      }
    }
    for (let feature in preferences) {
      preferences[feature] = preferences[feature] / total_scores;
    }
    return preferences;
  }

  // Get item features based on its properties
  private get_item_features(item_id: number): { [key: string]: number } {
    let item = this.find_item_by_id(item_id);
    if (!item) {
      throw new Error('Item does not exist in the system.');
    }
    return { genre: item.genre === 'Sci-Fi' ? 1 : 0 }; // Simplified feature extraction
  }

  // Find a user by ID
  private find_user_by_id(user_id: number): User {
    let user = this.userDatabase.find(u => u.id === user_id);
    if (!user) {
      throw new Error('User does not exist in the system.');
    }
    return user;
  }

  // Find an item by ID
  private find_item_by_id(item_id: number): Item | undefined {
    return this.itemDatabase.find(i => i.id === item_id);
  }
}

// Example usage
const system = new RecommendationSystem();

// Add users and items to the system
system.add_user({ id: 1, name: 'Alice' });
system.add_item({ id: 1, title: 'Book One', genre: 'Sci-Fi' });
system.add_item({ id: 2, title: 'Movie Two', genre: 'Action' });

// Add user scores
system.add_user_score(1, 1, 5); // Alice gives 5 stars to 'Book One'
system.add_user_score(1, 2, 3); // Alice gives 3 stars to 'Movie Two'

// Generate recommendations for Alice
const recommendations = system.recommend(1);
console.log(recommendations.map(r => `${r.user.name} recommends ${r.item.title}: Score ${r.score}`));