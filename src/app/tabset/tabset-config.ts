/* eslint-disable deprecation/deprecation */
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class VkTabsetConfig {
  justify: 'start' | 'center' | 'end' | 'fill' | 'justified' = 'start';
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  type: 'tabs' | 'pills' = 'tabs';
}
