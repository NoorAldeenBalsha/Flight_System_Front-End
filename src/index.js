import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AuthState from "./context/auth/authState";
import CartState from "./context/cart/cartState";
import ProductState from "./context/products/productState";
import LoadingState from "./context/loading/loadingState";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalToastProvider from "./components/GlobalToast";
import { LanguageProvider } from "./context/LanguageContext";
import process from "process";
window.process=process;
ReactDOM.render(
  <LanguageProvider>
    <React.StrictMode>
      <GlobalToastProvider>
        <ErrorBoundary>
          <AuthState>
            <LoadingState>
              <ProductState>
                <CartState>
                  <App />
                </CartState>
              </ProductState>
            </LoadingState>
          </AuthState>
        </ErrorBoundary>
      </GlobalToastProvider>
    </React.StrictMode>
  </LanguageProvider>,
  document.getElementById("root")
);