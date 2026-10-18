import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { OrderService } from '../../../services/common/order.service';
import { UiService } from '../../../services/core/ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Order } from '../../../interfaces/common/order.interface';
import { FileUploadService } from '../../../services/gallery/file-upload.service';

@Component({
  selector: 'app-packing-station',
  templateUrl: './packing-station.component.html',
  styleUrls: ['./packing-station.component.scss']
})
export class PackingStationComponent implements OnInit {

  // Barcode Scanner Listener
  barcodeBuffer = '';
  lastKeystrokeTime = 0;

  // Order Details
  orderId = '';
  order: Order | null = null;

  // Webcam
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(
    private orderService: OrderService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  // --- Keyboard Listener for Barcode Scanner ---
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Ignore input if it is from a focused text field, unless we want global
    // If the scanner acts as a keyboard, we capture fast keystrokes.
    const currentTime = new Date().getTime();

    if (currentTime - this.lastKeystrokeTime > 100) {
      this.barcodeBuffer = '';
    }

    if (event.key === 'Enter') {
      if (this.barcodeBuffer.length > 3) {
        this.processScannedCode(this.barcodeBuffer);
        this.barcodeBuffer = '';
      }
    } else if (event.key !== 'Shift') {
      this.barcodeBuffer += event.key;
    }

    this.lastKeystrokeTime = currentTime;
  }

  processScannedCode(code: string) {
    // Expected format could be just the order ID or "SL-xxx"
    // Let's trim SL- if exists
    let extractedId = code;
    if (code.startsWith('SL-')) {
      extractedId = code.substring(3);
    }
    this.orderId = extractedId;
    this.fetchOrder(this.orderId);
  }

  fetchOrder(id: string) {
    this.spinner.show();
    this.orderService.getAllOrders({
      filter: { orderId: id },
      pagination: { currentPage: 1, pageSize: 1 }
    }).subscribe(res => {
      this.spinner.hide();
      if (res.data && res.data.length > 0) {
        this.order = res.data[0];
        this.webcamImage = null; // reset image for new order
        this.uiService.success('Order Loaded Successfully');
      } else {
        this.order = null;
        this.uiService.warn('Order Not Found');
      }
    }, err => {
      this.spinner.hide();
      console.log(err);
      this.uiService.wrong('Error fetching order');
    });
  }


  // --- Webcam Functions ---
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  // --- Upload ---
  uploadSnapshot() {
    if (!this.webcamImage || !this.order) return;
    this.spinner.show();
    // Convert base64 to file
    const file = this.dataURLtoFile(this.webcamImage.imageAsDataUrl, `packing_${this.order.orderId}.jpeg`);
    
    const fileData = {
      file: file,
      fileName: file.name,
      folderPath: 'orders/packing'
    };

    this.fileUploadService.uploadSingleImage(fileData).subscribe(res => {
      if (res.downloadUrl) {
        // Update Order with packingImage
        const updateData = { packingImage: res.downloadUrl } as any;
        this.orderService.updateOrderById(this.order._id, updateData).subscribe(res2 => {
          this.spinner.hide();
          this.uiService.success('Packing photo uploaded successfully');
          this.order = null;
          this.orderId = '';
          this.webcamImage = null;
        }, err => {
          this.spinner.hide();
          console.log(err);
          this.uiService.wrong('Failed to save photo URL to order');
        });
      } else {
        this.spinner.hide();
        this.uiService.wrong('Failed to upload image');
      }
    }, err => {
      this.spinner.hide();
      console.log(err);
      this.uiService.wrong('Failed to upload image');
    });
  }

  dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

}
