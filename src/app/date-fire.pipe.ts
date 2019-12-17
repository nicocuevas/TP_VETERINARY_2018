import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'dateFire' })
export class DateFire implements PipeTransform {
  transform(value: any, ...args: any[]): string {
  	let current_datetime = new Date(value.toDate());
  	let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
    return formatted_date;
  }
}