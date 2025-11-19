export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NavbarProps {
  cartCount: number;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onClearCart: () => void;
}

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}