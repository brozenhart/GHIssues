import { organizationReducer } from '@/modules/organization';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  organization: organizationReducer,
});
