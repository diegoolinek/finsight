import pandas as pd
import google.generativeai as genai
import os
from django.db.models import Sum
from .models import Transaction

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class DashboardService:
    def __init__(self, user):
        self.user = user

    def get_financial_summary(self):
        """
        Gera o resumo financeiro consolidado e solicita um insight à IA.
        """

        qs = Transaction.objects.filter(user=self.user)
        
        if not qs.exists():
            return {
                "total_income": 0,
                "total_expense": 0,
                "balance": 0,
                "category_breakdown": {},
                "ai_insight": "Ainda não há transações suficientes para gerar insights. Faça o upload de um extrato!"
            }

        df = pd.DataFrame(list(qs.values('amount', 'category', 'date', 'description')))
        
        df['amount'] = df['amount'].astype(float)

        total_income = df[df['amount'] > 0]['amount'].sum()
        total_expense = df[df['amount'] < 0]['amount'].sum()
        balance = total_income + total_expense
        
        expenses_by_category = df[df['amount'] < 0].groupby('category')['amount'].sum().abs().sort_values(ascending=False).head(5)
        category_dict = expenses_by_category.to_dict()

        insight = self._generate_ai_advice(total_income, total_expense, category_dict)

        return {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "balance": round(balance, 2),
            "category_breakdown": category_dict,
            "ai_insight": insight
        }

    def _generate_ai_advice(self, income, expense, categories):
        """
        Envia os totais anonimizados para o Gemini e pede um conselho.
        """
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = f"""
            Atue como um consultor financeiro pessoal, direto e breve.
            Analise os dados financeiros do meu mês:
            
            - Receitas Totais: R$ {income:.2f}
            - Despesas Totais: R$ {abs(expense):.2f}
            - Principais Categorias de Gasto: {categories}
            
            Com base nisso, escreva UM parágrafo curto (máximo 3 linhas) com uma observação sobre minha saúde financeira e uma dica prática.
            Fale diretamente comigo ("Você gastou...").
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return "Não foi possível gerar o conselho financeiro no momento."
