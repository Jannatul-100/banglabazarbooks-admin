import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {

  allPages: any[] = [
    // { _id: 1, name: 'Online Payment Methods', slug: 'online-payment-methods' },
    { _id: 1, name: 'কীভাবে ওয়েবসাইেট অর্ডার করবেন?', slug: 'how-to-order-website' },
    { _id: 2, name: 'আমাদের সম্পর্কে', slug: 'about-us' },
    { _id: 4, name: 'যোগাযোগ করুন', slug: 'contact-us' },
    // { _id: 4, name: 'গোপনীয়তা নীতি', slug: 'privacy-policy' },
    // { _id: 4, name: 'ডেলিভারি নীতি', slug: 'delivery-policy' },

    // { _id: 5, name: 'শর্তাবলী', slug: 'terms-&-conditions' },
    // { _id: 5, name: 'প্রাপ্তিস্থান', slug: 'achievement' },
    { _id: 5, name: 'ব্যবহারের শর্তাবলী', slug: 'terms-&-conditions' },
    { _id: 5, name: 'মূল্য পরিশোধ পদ্ধতি', slug: 'method-of-payment' },
    { _id: 4, name: 'ডেলিভারি নীতি', slug: 'delivery-policy' },
    { _id: 3, name: 'পণ্য ফেরত ও পরিবর্তন নীতি', slug: 'return-&-refund-policy' },
    { _id: 3, name: 'মূল্য ফেরতনীতি', slug: 'refund-policy' },
    { _id: 4, name: 'গ্রাহক তথ্য সংরক্ষণ নীতি', slug: 'privacy-policy' },
    // { _id: 6, name: 'Customer Service', slug: 'customer-service' },
    { _id: 7, name: 'আমাদের কার্যক্রম', slug: 'আমাদের-কার্যক্রম' },
    { _id: 8, name: 'বাংলাবাজার বুকস পরিচিতি', slug: 'বাংলাবাজার বুকস-পরিচিতি' },
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
