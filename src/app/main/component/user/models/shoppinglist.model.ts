export interface ShoppingList {
  id: number;
  status: string;
  text: string;
  selected?: boolean;
  custom?: boolean;
}
