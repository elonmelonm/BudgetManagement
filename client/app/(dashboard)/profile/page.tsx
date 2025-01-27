'use client';

import { useState, useEffect } from 'react';
import { fetchTransactions, fetchCategories, deleteTransaction, fetchBudgets, createTransaction } from '@/services/api';
import { TransactionList } from '@/components/transactions/transaction-list';
import { EditTransactionDialog } from '@/components/transactions/editTransactionDialog';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function ProfilePage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, categoriesData, budgetResponse] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchBudgets(),
        ]);
        setTransactions(transactionsData);
        setCategories(categoriesData);

        if (budgetResponse && budgetResponse.initialAmount) {
          setInitialBudget(budgetResponse.initialAmount);
        } else {
          setInitialBudget(0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const transactionToDelete = transactions.find((t) => t.id === transactionId);

      if (transactionToDelete) {
        if (transactionToDelete.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget - transactionToDelete.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget + transactionToDelete.amount);
        }

        await deleteTransaction(transactionId);
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== transactionId)
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
    }
  };

  const handleTransactionUpdate = (updatedTransaction) => {
    setTransactions((prevTransactions) => {
      const oldTransaction = prevTransactions.find((t) => t.id === updatedTransaction.id);

      if (oldTransaction) {
        if (oldTransaction.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget - oldTransaction.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget + oldTransaction.amount);
        }

        if (updatedTransaction.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget + updatedTransaction.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget - updatedTransaction.amount);
        }
      }

      return prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      );
    });
  };

  const handleTransactionCreated = (newTransaction) => {
    // Ajouter la nouvelle transaction à la liste
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

    // Mettre à jour le solde en fonction du type de transaction
    if (newTransaction.type === 'income') {
      setInitialBudget((prevBudget) => prevBudget + newTransaction.amount);
    } else {
      setInitialBudget((prevBudget) => prevBudget - newTransaction.amount);
    }
  };

  return (
    <div className="space-y-8">
      {/* Liste des transactions */}
      <TransactionList
        transactions={transactions}
        categories={categories}
        onDeleteTransaction={handleDeleteTransaction}
        onEditTransaction={handleEditClick}
        onTransactionCreated={handleTransactionCreated}
        initialBudget={initialBudget} // Passez le budget initial à TransactionList
      />

      {/* Dialogue pour éditer une transaction */}
      {selectedTransaction && (
        <EditTransactionDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          transaction={selectedTransaction}
          onTransactionUpdated={handleTransactionUpdate}
        />
      )}
    </div>
  );
}