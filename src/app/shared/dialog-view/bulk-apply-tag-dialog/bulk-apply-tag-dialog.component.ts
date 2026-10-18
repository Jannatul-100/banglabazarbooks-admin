import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagService } from '../../../services/common/tag.service';
import { Tag } from '../../../interfaces/common/tag.interface';
import { FilterData } from '../../../interfaces/core/filter-data';

@Component({
  selector: 'app-bulk-apply-tag-dialog',
  templateUrl: './bulk-apply-tag-dialog.component.html',
  styleUrls: ['./bulk-apply-tag-dialog.component.scss'],
})
export class BulkApplyTagDialogComponent implements OnInit {
  tags: Tag[] = [];
  selectedTagIds: string[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<BulkApplyTagDialogComponent>,
    private readonly tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: { count: number },
  ) {}

  ngOnInit(): void {
    const filterData: FilterData = {
      filter: null,
      pagination: null,
      select: { name: 1, slug: 1, priority: 1 },
      sort: { priority: -1, createdAt: -1 },
    };

    this.tagService.getAllTag(filterData, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.tags = res.data || [];
        }
      },
    });
  }

  apply(): void {
    if (!this.selectedTagIds.length) {
      return;
    }

    this.dialogRef.close({ tagIds: this.selectedTagIds });
  }
}
