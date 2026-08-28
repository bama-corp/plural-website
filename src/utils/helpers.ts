import { Plan } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-AO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const openWhatsApp = (phone: string, message?: string): void => {
  const text =
    message || 'Olá! Gostaria de saber mais sobre os planos da Plural.';
  const url = `https://wa.me/${phone.replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

export const sendEmail = (
  email: string,
  subject?: string,
  body?: string
): void => {
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject || 'Contato Plural'
  )}&body=${encodeURIComponent(
    body || 'Olá! Gostaria de saber mais sobre os planos da Plural.'
  )}`;
  window.location.href = mailto;
};

export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Altura aproximada do header fixo
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const getPeriodText = (period: string): string => {
  switch (period) {
    case 'monthly':
      return 'mês';
    case 'quarterly':
      return 'trimestre';
    case 'yearly':
      return 'ano';
    default:
      return period;
  }
};

export const getPeriodPrice = (plan: Plan): number => {
  switch (plan.period) {
    case 'monthly':
      return plan.price;
    case 'quarterly':
      return plan.price / 3;
    case 'yearly':
      return plan.price / 12;
    default:
      return plan.price;
  }
};
