import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Translator } from '../../../interfaces/common/translator.interface';
import { EMPTY, filter, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { TranslatorService } from '../../../services/common/translator.service';
import { UtilsService } from '../../../services/core/utils.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Pagination } from '../../../interfaces/core/pagination';
import { FilterData } from '../../../interfaces/gallery/filter-data';

@Component({
  selector: 'app-translator-select',
  templateUrl: './translator-select.component.html',
  styleUrls: ['./translator-select.component.scss'],
})
export class TranslatorSelectComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('controlName') controlName: FormControl;
  @Input('required') required: boolean = false;
  @Input('placeholder') placeholder: string = 'Select Translator';
  @Input('data') data: Translator | Translator[];

  public dataList: Translator[] = [];
  public filteredDataList: ReplaySubject<Translator[]> = new ReplaySubject<Translator[]>(1);
  searchDataList: Translator[] = [];

  public selectCtrl: FormControl;
  public searchCtrl: FormControl = new FormControl();
  public searching = false;

  currentPage = 1;
  dataPerPage = 10;
  totalData = 0;

  protected _onDestroy = new Subject<void>();

  @ViewChild('matSearchSelect') matSearchSelect: MatSelectSearchComponent;

  constructor(
    private translatorService: TranslatorService,
    private utilsService: UtilsService,
  ) {}

  ngOnInit(): void {
    if (this.controlName) {
      this.selectCtrl = this.controlName;
    } else {
      this.selectCtrl = new FormControl();
    }
    this.getAllTranslatorList();
  }

  ngOnChanges() {
    if (this.data) {
      if (Array.isArray(this.data)) {
        this.dataList.push(...this.data);
        const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', this.dataList, this.dataList);
        this.dataList = uniqueData;
        this.selectCtrl.setValue(this.data);
      } else {
        this.dataList.push(this.data);
        const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', this.dataList, this.dataList);
        this.dataList = uniqueData;
        this.selectCtrl.setValue([this.data]);
      }
    }
  }

  compareFn(a: any, b: any): boolean {
    if (!a || !b) return a === b;
    const aId = typeof a === 'object' ? a._id : a;
    const bId = typeof b === 'object' ? b._id : b;
    return aId === bId;
  }

  ngAfterViewInit() {
    this.searchCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((search) => {
          if (!this.searchCtrl.value.trim()) {
            this.searching = false;
            if (this.selectCtrl.value && this.selectCtrl.value.length > 0) {
              const singleArray = Array.isArray(this.selectCtrl.value)
                ? this.selectCtrl.value
                : [this.selectCtrl.value];
              const allTranslators = [...this.searchDataList, ...this.dataList];
              const selectedData = allTranslators.filter((m) => {
                return singleArray.some((n: any) => n === m._id || n === m);
              });
              const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
              this.filteredDataList.next([...uniqueData, ...this.dataList]);
              return EMPTY;
            } else {
              this.filteredDataList.next([...this.dataList]);
              return EMPTY;
            }
          }

          const pagination: Pagination = {
            pageSize: 10,
            currentPage: 0,
          };

          const mSelect = {
            name: 1,
            nameEn: 1,
            slug: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: null,
            select: mSelect,
            sort: { createdAt: -1 },
          };

          return this.translatorService.getAllTranslator(filterData, search);
        }),
      )
      .subscribe({
        next: (res) => {
          this.searching = false;
          this.searchDataList = [...this.searchDataList, ...res.data];
          this.filteredDataList.next(res.data);
        },
        error: (error) => {
          this.searching = false;
          console.log(error);
        },
      });
  }

  getNextTestBatch() {
    if (this.searchCtrl.value) {
      return;
    }
    this.currentPage += 1;
    this.getAllTranslatorList();
  }

  private getAllTranslatorList() {
    const mSelect = {
      name: 1,
      nameEn: 1,
      slug: 1,
    };

    const pagination: Pagination = {
      pageSize: this.dataPerPage,
      currentPage: this.currentPage - 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: pagination,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.translatorService.getAllTranslator(filter, null).subscribe({
      next: (res) => {
        this.totalData = res.count;
        if (this.selectCtrl.value) {
          const singleArray = Array.isArray(this.selectCtrl.value)
            ? this.selectCtrl.value
            : [this.selectCtrl.value];
          const allTranslators = [...this.searchDataList, ...this.dataList];
          const selectedData = allTranslators.filter((m) => {
            return singleArray.some((n) => n._id === m._id || n === m._id);
          });
          const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
          this.dataList = this.utilsService.margeMultipleArrayUnique(
            '_id',
            [...this.dataList, ...res.data],
            [...this.dataList, ...res.data],
          );
          this.filteredDataList.next(
            this.utilsService.margeMultipleArrayUnique(
              '_id',
              [...uniqueData, ...this.dataList],
              [...uniqueData, ...this.dataList],
            ),
          );
        } else {
          this.dataList = this.utilsService.margeMultipleArrayUnique(
            '_id',
            [...this.dataList, ...res.data],
            [...this.dataList, ...res.data],
          );
          this.filteredDataList.next(this.dataList);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onClear() {
    this.searchCtrl.reset();
    this.getDefaultDataArray();
  }

  private getDefaultDataArray() {
    if (this.selectCtrl.value) {
      const singleArray = Array.isArray(this.selectCtrl.value)
        ? this.selectCtrl.value
        : [this.selectCtrl.value];
      const allTranslators = [...this.searchDataList, ...this.dataList];
      const selectedData = allTranslators.filter((m) => {
        return singleArray.some((n) => n._id === m._id);
      });
      const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
      this.filteredDataList.next([...uniqueData, ...this.dataList]);
      if (Array.isArray(this.selectCtrl.value)) {
        this.selectCtrl.patchValue(uniqueData);
      } else {
        this.selectCtrl.patchValue(uniqueData[0]);
      }
    } else {
      this.filteredDataList.next([...this.dataList]);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
