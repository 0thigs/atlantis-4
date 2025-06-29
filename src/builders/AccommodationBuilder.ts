import { AccommodationCategory, AccommodationBuilder as IAccommodationBuilder } from '../types';

export const ACCOMMODATION_CATEGORIES: AccommodationCategory[] = [
  {
    id: 'couple-simple',
    name: 'Casal Simples',
    description: 'Perfeito para casais que buscam conforto e intimidade',
    beds: 1,
    suites: 1,
    garage: false,
    basePrice: 120,
    maxOccupancy: 2,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi'],
    totalUnits: 10
  },
  {
    id: 'family-simple',
    name: 'Família Simples',
    description: 'Ideal para famílias pequenas com comodidades básicas',
    beds: 2,
    suites: 1,
    garage: false,
    basePrice: 180,
    maxOccupancy: 4,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi', 'Frigobar'],
    totalUnits: 8
  },
  {
    id: 'family-plus',
    name: 'Família Plus',
    description: 'Acomodação familiar aprimorada com espaço adicional',
    beds: 3,
    suites: 2,
    garage: true,
    basePrice: 250,
    maxOccupancy: 6,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi', 'Frigobar', 'Varanda', 'Cozinha'],
    totalUnits: 6
  },
  {
    id: 'family-super',
    name: 'Família Super',
    description: 'Suíte familiar premium com amenidades de luxo',
    beds: 4,
    suites: 3,
    garage: true,
    basePrice: 350,
    maxOccupancy: 8,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi', 'Frigobar', 'Varanda', 'Cozinha Completa', 'Sala de Estar', 'Jacuzzi'],
    totalUnits: 4
  },
  {
    id: 'single-simple',
    name: 'Individual Simples',
    description: 'Acomodação confortável para viajantes solo',
    beds: 1,
    suites: 1,
    garage: false,
    basePrice: 80,
    maxOccupancy: 1,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi', 'Mesa de Trabalho'],
    totalUnits: 12
  },
  {
    id: 'single-plus',
    name: 'Individual Plus',
    description: 'Acomodação individual aprimorada com recursos premium',
    beds: 1,
    suites: 1,
    garage: true,
    basePrice: 120,
    maxOccupancy: 2,
    amenities: ['Ar Condicionado', 'Banheiro Privativo', 'TV', 'WiFi', 'Mesa de Trabalho', 'Frigobar', 'Varanda'],
    totalUnits: 5
  }
];

export class AccommodationBuilder {
  private accommodation: IAccommodationBuilder;

  constructor(categoryId: string) {
    const category = ACCOMMODATION_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) {
      throw new Error(`Categoria ${categoryId} não encontrada`);
    }
    
    this.accommodation = {
      category,
      customizations: {}
    };
  }

  addExtraBeds(count: number): AccommodationBuilder {
    this.accommodation.customizations.extraBeds = count;
    return this;
  }

  addPremiumAmenities(amenities: string[]): AccommodationBuilder {
    this.accommodation.customizations.premiumAmenities = amenities;
    return this;
  }

  addSpecialRequests(requests: string[]): AccommodationBuilder {
    this.accommodation.customizations.specialRequests = requests;
    return this;
  }

  calculateTotalPrice(): number {
    let totalPrice = this.accommodation.category.basePrice;
    
    if (this.accommodation.customizations.extraBeds) {
      totalPrice += this.accommodation.customizations.extraBeds * 30;
    }
    
    if (this.accommodation.customizations.premiumAmenities) {
      totalPrice += this.accommodation.customizations.premiumAmenities.length * 25;
    }
    
    return totalPrice;
  }

  build(): IAccommodationBuilder {
    return { ...this.accommodation };
  }

  static getAvailableCategories(): AccommodationCategory[] {
    return [...ACCOMMODATION_CATEGORIES];
  }

  static createFromCategory(categoryId: string): AccommodationBuilder {
    return new AccommodationBuilder(categoryId);
  }
} 