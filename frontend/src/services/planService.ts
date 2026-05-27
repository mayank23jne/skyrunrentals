import api from './api';

export interface SubscriptionPlan {
  id: number;
  planName: string;
  price: string;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  description6?: string;
  description7?: string;
  description8?: string;
  description9?: string;
  description10?: string;
  description11?: string;
  description12?: string;
  description13?: string;
}

export const planService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>('/plans');
    return response.data;
  },
};
