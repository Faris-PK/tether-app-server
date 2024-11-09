export const getExpirationDate = (planType: 'monthly' | 'yearly'): Date => {
    const today = new Date();
    if (planType === 'monthly') {
      return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    } else {
      return new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    }
  };