import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { api } from "./services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

// interface TransactionInput = {
//   title: string;
//   amount: number;
//   type: string;
//   category: string;
// };

type TransactionInput = Omit<Transaction, "id" | "createdAt">;

// type TransactionInput = Pick<Transaction, "title" | "amount" | "type" | "category">;

interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export const TransactionsProvider = ({
  children,
}: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const createTransaction = useCallback((transaction: TransactionInput) => {
    api.post("/transactions", transaction);
  }, []);

  useEffect(() => {
    api
      .get("transactions")
      .then(({ data: { transactions } }) => setTransactions(transactions));
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
