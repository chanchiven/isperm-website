'use client';

import {memo} from 'react';
import {useTranslations} from 'next-intl';
import {SearchFilters} from '@/lib/search/types';
import {FilterChipButton} from './FilterChipButton';
import {FilterChipGroup} from './FilterChipGroup';
import {
  clearFiltersButtonStyle,
  filterPanelStyle,
  filterRowStyle
} from './searchModalStyles';

const SEARCH_TYPES = ['product', 'article', 'image', 'page'] as const;
const ARTICLE_CATEGORIES = ['human', 'veterinary'] as const;

interface SearchFilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export const SearchFilterPanel = memo(function SearchFilterPanel({
  filters,
  onChange
}: SearchFilterPanelProps) {
  const t = useTranslations('search');

  const toggleType = (type: (typeof SEARCH_TYPES)[number]) => {
    const currentTypes = filters.types || [...SEARCH_TYPES];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((item) => item !== type)
      : [...currentTypes, type];
    onChange({
      ...filters,
      types: newTypes.length === SEARCH_TYPES.length ? undefined : newTypes
    });
  };

  const toggleCategory = (category: (typeof ARTICLE_CATEGORIES)[number]) => {
    const currentCategories = filters.categories || [...ARTICLE_CATEGORIES];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((item) => item !== category)
      : [...currentCategories, category];
    onChange({
      ...filters,
      categories: newCategories.length === ARTICLE_CATEGORIES.length ? undefined : newCategories
    });
  };

  const hasActiveFilters = Boolean(filters.types || filters.categories || filters.sortBy);

  return (
    <div style={filterPanelStyle}>
      <div style={filterRowStyle}>
        <FilterChipGroup label={t('filters.type')}>
          {SEARCH_TYPES.map((type) => (
            <FilterChipButton
              key={type}
              label={t(`types.${type}`)}
              selected={!filters.types || filters.types.includes(type)}
              onClick={() => toggleType(type)}
            />
          ))}
        </FilterChipGroup>

        <FilterChipGroup label={t('filters.category')}>
          {ARTICLE_CATEGORIES.map((category) => (
            <FilterChipButton
              key={category}
              label={t(`filters.${category}`)}
              selected={!filters.categories || filters.categories.includes(category)}
              onClick={() => toggleCategory(category)}
            />
          ))}
        </FilterChipGroup>

        <FilterChipGroup label={t('filters.sortBy')} wrap={false}>
          <FilterChipButton
            label={t('filters.relevance')}
            selected={!filters.sortBy || filters.sortBy === 'relevance'}
            rounded="square"
            onClick={() => onChange({...filters, sortBy: 'relevance'})}
          />
          <FilterChipButton
            label={t('filters.titleSort')}
            selected={filters.sortBy === 'title'}
            rounded="square"
            onClick={() => onChange({...filters, sortBy: 'title'})}
          />
        </FilterChipGroup>

        {hasActiveFilters ? (
          <button type="button" onClick={() => onChange({})} style={clearFiltersButtonStyle}>
            {t('filters.clearFilters')}
          </button>
        ) : null}
      </div>
    </div>
  );
});
