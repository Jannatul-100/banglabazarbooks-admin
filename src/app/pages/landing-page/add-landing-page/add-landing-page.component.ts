import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { defaultUploadImage } from '../../../core/utils/app-data';
import { Product } from '../../../interfaces/common/product.interface';
import { LandingPage, LandingPageBenefitCard, LandingPageFooterStat, LandingPageTrustItem } from '../../../interfaces/common/landing-page.interface';
import { Gallery } from '../../../interfaces/gallery/gallery.interface';
import { LandingPageService } from '../../../services/common/landing-page.service';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { ProductListComponent } from '../../../shared/dialog-view/product-list/product-list.component';
import { AllImagesDialogComponent } from '../../gallery/images/all-images-dialog/all-images-dialog.component';
import { StringToSlugPipe } from '../../../shared/pipes/string-to-slug.pipe';

@Component({
  selector: 'app-add-landing-page',
  templateUrl: './add-landing-page.component.html',
  styleUrls: ['./add-landing-page.component.scss'],
  providers: [StringToSlugPipe],
})
export class AddLandingPageComponent implements OnInit, OnDestroy {
  id?: string;
  landingPage?: LandingPage;
  pickedHeroImage = defaultUploadImage;
  selectedProducts: Product[] = [];
  trustItems: LandingPageTrustItem[] = [
    { icon: 'fa-truck', title: 'দ্রুত ডেলিভারি', subtitle: '' },
    { icon: 'fa-lock', title: 'নিরাপদ পেমেন্ট', subtitle: '' },
  ];
  insidePages: string[] = [];
  heroPoints: string[] = ['', '', ''];
  headerBadges: string[] = ['100% Free', 'No Spam', 'Instant Download'];
  leadFormTrustItems: LandingPageTrustItem[] = [
    { icon: 'lock', title: 'আপনার তথ্য 100% নিরাপদ', subtitle: 'আমরা আপনার তথ্য কখনোই শেয়ার করব না' },
    { icon: 'bolt', title: 'ইনস্ট্যান্ট ডাউনলোড', subtitle: 'তথ্য দেওয়ার সাথে সাথেই PDF ডাউনলোড হবে' },
    { icon: 'shield', title: 'কোনো স্প্যাম নয়', subtitle: 'শুধু গুরুত্বপূর্ণ আপডেটই পাঠানো হবে' },
  ];
  benefitCards: LandingPageBenefitCard[] = [
    { icon: 'checklist', title: 'সম্পূর্ণ চেকলিস্ট', description: 'ডিজিটাল মার্কেটিংয়ের প্রতিটি ধাপের জন্য প্রস্তুত চেকলিস্ট' },
    { icon: 'target', title: 'স্টেপ বাই স্টেপ গাইড', description: 'কোথায় শুরু করবেন, কীভাবে এগোবেন — সব কিছু সহজ ভাষায়' },
    { icon: 'analytics', title: 'পারফরম্যান্স ট্র্যাকিং', description: 'কোন KPI ট্র্যাক করবেন, কীভাবে মাপবেন — সব ব্যাখ্যা সহ' },
    { icon: 'schedule', title: 'সময় সাশ্রয়ী', description: 'ঘণ্টার পর ঘণ্টা অনুসন্ধান না করে সরাসরি কাজ শুরু করুন' },
  ];
  footerStats: LandingPageFooterStat[] = [
    { icon: 'groups', text: 'Trusted by 10,000+ Users' },
    { icon: 'verified', text: '100% Free Resource' },
    { icon: 'download', text: 'Instant Access' },
  ];

  get isV2Template(): boolean {
    return this.dataForm?.get('template')?.value === 'v2';
  }

  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;
  private subRouteOne?: Subscription;
  private subAutoSlug?: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private uiService: UiService,
    private landingPageService: LandingPageService,
    private spinnerService: NgxSpinnerService,
    private stringToSlugPipe: StringToSlugPipe,
  ) {}

  ngOnInit(): void {
    this.initDataForm();
    this.applyRouteTemplate();
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id') ?? undefined;
      if (this.id) {
        this.getLandingPageById();
      }
    });
    this.autoGenerateSlug();
  }

  private applyRouteTemplate(): void {
    const template = this.activatedRoute.snapshot.data['template'] as string | undefined;
    if (template === 'v2') {
      this.dataForm?.patchValue({
        template: 'v2',
        badgeText: 'ফ্রি রিসোর্স',
        title: 'ফ্রি ডাউনলোড করুন',
        titleHighlight: 'ডিজিটাল মার্কেটিং চেকলিস্ট',
        subtitle:
          'আপনার ব্যবসার ডিজিটাল মার্কেটিং কৌশল পরিকল্পনা করতে এই ফ্রি চেকলিস্টটি ডাউনলোড করুন।',
        primaryColor: '#2563eb',
      });
    }
  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      template: ['v1'],
      status: ['publish'],
      brandTagline: ['Learn. Grow. Succeed.'],
      badgeText: ['সীমিত সময়ের অফার'],
      title: [null],
      titleHighlight: [null],
      subtitle: [null],
      heroImage: [null],
      description: [null],
      featuresTitle: ['প্রয়োজনীয় তথ্য'],
      featuresContent: [null],
      resourceCardTitle: ['20+ পেজের প্র্যাকটিক্যাল গাইড'],
      resourceCardSubtitle: ['বাংলায় | Instant PDF Download'],
      leadFormTitle: ['ফ্রি ডাউনলোড করতে নিচের তথ্যগুলো দিন'],
      leadFormSubtitle: ['তথ্য দেওয়ার সাথে সাথেই আপনি ডাউনলোড বাটনে ক্লিক করতে পারবেন।'],
      leadFormNote: ['সব তথ্য পূরণ করলে ডাউনলোড বাটন সক্রিয় হবে'],
      leadFormButtonText: ['ডাউনলোড করুন'],
      benefitsTitle: ['এই চেকলিস্টে যা যা পাবেন'],
      downloadFileUrl: [null],
      insidePagesTitle: ["বইয়ের ভেতরের পাতা"],
      productSectionTitle: ['আপনার পছন্দের বই বেছে নিন'],
      productSectionSubtitle: ['একাধিক বই একসাথে অর্ডার করলে বাড়তি সুবিধা পাবেন'],
      salePrice: [null],
      originalPrice: [null],
      discountPercent: [null],
      primaryColor: ['#1a4d2e'],
      videoUrl: [null],
      endDate: [null],
      seoTitle: [null],
      seoDescription: [null],
      priority: [0],
    });
  }

  private setDataForm() {
    if (!this.landingPage) {
      return;
    }

    const featuresContent =
      this.landingPage.featuresContent ||
      this.convertLegacyFeaturesToHtml(this.landingPage.features);

    this.dataForm?.patchValue({
      ...this.landingPage,
      featuresContent,
    });
    this.trustItems = this.landingPage.trustItems?.length
      ? [...this.landingPage.trustItems]
      : this.trustItems;
    this.insidePages = [...(this.landingPage.insidePages ?? [])];
    this.heroPoints = this.landingPage.heroPoints?.length
      ? [...this.landingPage.heroPoints]
      : ['', '', ''];
    this.headerBadges = this.landingPage.headerBadges?.length
      ? [...this.landingPage.headerBadges]
      : this.headerBadges;
    this.leadFormTrustItems = this.landingPage.leadFormTrustItems?.length
      ? [...this.landingPage.leadFormTrustItems]
      : this.leadFormTrustItems;
    this.benefitCards = this.landingPage.benefitCards?.length
      ? [...this.landingPage.benefitCards]
      : this.benefitCards;
    this.footerStats = this.landingPage.footerStats?.length
      ? [...this.landingPage.footerStats]
      : this.footerStats;
    this.selectedProducts = (this.landingPage.products as Product[]) ?? [];
    if (this.landingPage.heroImage) {
      this.pickedHeroImage = this.landingPage.heroImage;
    }
  }

  onSubmit() {
    if (this.dataForm?.invalid) {
      this.uiService.warn('Please complete all required fields');
      this.dataForm.markAllAsTouched();
      return;
    }

    if (!this.isV2Template && !this.selectedProducts.length) {
      this.uiService.warn('Please select at least one product');
      return;
    }

    if (this.isV2Template && !this.dataForm?.value.downloadFileUrl) {
      this.uiService.warn('Please add download file URL for Landing Page 2');
      return;
    }

    const mData: LandingPage = this.sanitizePayload({
      ...this.dataForm?.value,
      trustItems: this.isV2Template ? [] : this.trustItems.filter((t) => t.title),
      insidePages: this.isV2Template ? [] : this.insidePages,
      heroPoints: this.isV2Template ? this.heroPoints.filter(Boolean) : [],
      headerBadges: this.isV2Template ? this.headerBadges.filter(Boolean) : [],
      leadFormTrustItems: this.isV2Template
        ? this.leadFormTrustItems.filter((t) => t.title)
        : [],
      benefitCards: this.isV2Template
        ? this.benefitCards.filter((b) => b.title)
        : [],
      footerStats: this.isV2Template
        ? this.footerStats.filter((f) => f.text)
        : [],
      products: this.isV2Template ? [] : this.selectedProducts.map((p) => p._id),
    });

    if (this.id) {
      this.updateLandingPageById(mData);
    } else {
      this.addLandingPage(mData);
    }
  }

  addHeroPoint() {
    this.heroPoints.push('');
  }

  removeHeroPoint(index: number) {
    this.heroPoints.splice(index, 1);
  }

  addBenefitCard() {
    this.benefitCards.push({ icon: 'star', title: '', description: '' });
  }

  removeBenefitCard(index: number) {
    this.benefitCards.splice(index, 1);
  }

  addLeadTrustItem() {
    this.leadFormTrustItems.push({ icon: 'check', title: '', subtitle: '' });
  }

  removeLeadTrustItem(index: number) {
    this.leadFormTrustItems.splice(index, 1);
  }

  addTrustItem() {
    this.trustItems.push({ icon: 'fa-check', title: '', subtitle: '' });
  }

  removeTrustItem(index: number) {
    this.trustItems.splice(index, 1);
  }

  removeInsidePage(index: number) {
    this.insidePages.splice(index, 1);
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }

  openHeroGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: { type: 'single', count: 1 },
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult?.data?.length) {
        const image: Gallery = dialogResult.data[0];
        this.dataForm?.patchValue({ heroImage: image.url });
        this.pickedHeroImage = image.url;
      }
    });
  }

  openInsidePagesGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: { type: 'multiple', count: 20 },
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult?.data?.length) {
        this.insidePages = [
          ...this.insidePages,
          ...dialogResult.data.map((img: Gallery) => img.url),
        ];
      }
    });
  }

  openProductListDialog() {
    const dialogRef = this.dialog.open(ProductListComponent, {
      data: {
        ids: this.selectedProducts.length
          ? this.selectedProducts.map((m) => m._id)
          : null,
      },
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult?.data) {
        return;
      }
      let updated = [...this.selectedProducts];
      if (dialogResult.data.unselectedIds?.length) {
        updated = updated.filter(
          (item) => dialogResult.data.unselectedIds.indexOf(item._id) === -1,
        );
      }
      if (dialogResult.data.selected?.length) {
        dialogResult.data.selected.forEach((product: Product) => {
          if (!updated.find((p) => p._id === product._id)) {
            updated.push(product);
          }
        });
      }
      this.selectedProducts = updated;
    });
  }

  private addLandingPage(data: LandingPage) {
    this.spinnerService.show();
    this.subDataOne = this.landingPageService.addLandingPage(data).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
          this.selectedProducts = [];
          this.insidePages = [];
          this.pickedHeroImage = defaultUploadImage;
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: () => this.spinnerService.hide(),
    });
  }

  private getLandingPageById() {
    this.spinnerService.show();
    this.subDataTwo = this.landingPageService.getLandingPageById(this.id!).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.landingPage = res.data;
          this.setDataForm();
        }
      },
      error: () => this.spinnerService.hide(),
    });
  }

  private updateLandingPageById(data: LandingPage) {
    this.spinnerService.show();
    this.subDataOne = this.landingPageService
      .updateLandingPageById(this.landingPage!._id!, data)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: () => this.spinnerService.hide(),
      });
  }

  private convertLegacyFeaturesToHtml(
    features?: Array<{ title?: string; value?: string }>,
  ): string | null {
    if (!features?.length) {
      return null;
    }

    const items = features
      .filter((f) => f.title || f.value)
      .map((f) => {
        const title = f.title ? `<strong>${f.title}</strong>` : '';
        const value = f.value ? `<span>${f.value}</span>` : '';
        return `<li>${title}${title && value ? ' — ' : ''}${value}</li>`;
      });

    return items.length ? `<ul>${items.join('')}</ul>` : null;
  }

  private sanitizePayload(data: LandingPage): LandingPage {
    const cleaned: LandingPage = { ...data };
    const numberFields: Array<keyof LandingPage> = [
      'salePrice',
      'originalPrice',
      'discountPercent',
      'priority',
    ];

    numberFields.forEach((field) => {
      const value = cleaned[field] as unknown;
      if (value === '' || value === null || value === undefined) {
        delete cleaned[field];
        return;
      }
      const num = Number(value);
      if (!Number.isNaN(num)) {
        (cleaned as any)[field] = num;
      } else {
        delete cleaned[field];
      }
    });

    return cleaned;
  }

  private autoGenerateSlug() {
    this.subAutoSlug = this.dataForm
      ?.get('name')
      ?.valueChanges.subscribe((name) => {
        if (name) {
          this.dataForm?.patchValue(
            { slug: this.stringToSlugPipe.transform(name, '-') },
            { emitEvent: false },
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.subDataOne?.unsubscribe();
    this.subDataTwo?.unsubscribe();
    this.subRouteOne?.unsubscribe();
    this.subAutoSlug?.unsubscribe();
  }
}
