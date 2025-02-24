"use client";
import SwaggerAgent from './swaggerAgent';

export default class Jellyfin extends SwaggerAgent {
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, apiKey);
  }

  setApiKey(apiKey: string) {
    this.apiKey = `Mediabrowser Token="${apiKey}"`;
  }

  setup() {
    this.setApiKey(this.apiKey);
  }
}