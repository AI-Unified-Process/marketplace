import { UploadManager, type UploadFormat } from '@vaadin/upload/vaadin-upload-manager.js';

/**
 * Connector element for UploadManager. This element is added as a virtual child
 * of the owner component and handles initialization of the client-side
 * UploadManager instance based on properties set from the server.
 *
 * Properties read from the element:
 * - target: Upload URL (from attribute, auto-converted by Flow)
 * - maxFiles: Maximum number of files (optional)
 * - maxFileSize: Maximum file size in bytes (optional)
 * - accept: Accepted file types (optional)
 * - noAuto: Disable auto-upload (optional)
 * - uploadFormat: Upload format ('raw' or 'multipart', optional)
 * - disabled: Whether the manager is disabled (from attribute)
 *
 * Events dispatched to the connector element for server-side handling:
 * - file-remove: When a file is removed
 * - file-reject: When a file is rejected
 */
class UploadManagerConnector extends HTMLElement {
  public manager = new UploadManager();

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'target' && oldValue !== newValue) {
      this.manager.target = newValue;
    } else if (name === 'disabled' && oldValue !== newValue) {
      this.manager.disabled = newValue !== null;
    }
  }

  static get observedAttributes() {
    return ['target', 'disabled'];
  }

  set maxFiles(value: number) {
    this.manager.maxFiles = value;
  }

  set maxFileSize(value: number) {
    this.manager.maxFileSize = value;
  }

  set accept(value: string) {
    this.manager.accept = value;
  }

  set noAuto(value: boolean) {
    this.manager.noAuto = value;
  }

  set uploadFormat(value: UploadFormat) {
    this.manager.uploadFormat = value;
  }

  clearFileList() {
    this.manager.files = [];
  }

  private uploading = false;

  constructor() {
    super();

    // Forward events to the connector element for server-side handling
    this.manager.addEventListener('file-remove', (e: CustomEvent) => {
      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { fileName: e.detail.file?.name },
          bubbles: false
        })
      );
    });

    this.manager.addEventListener('file-reject', (e: CustomEvent) => {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: {
            fileName: e.detail.file?.name,
            errorMessage: e.detail.error
          },
          bubbles: false
        })
      );
    });

    // Track upload state to detect when all uploads finish
    this.manager.addEventListener('upload-start', () => {
      this.uploading = true;
    });

    const checkAllFinished = () => {
      const isUploading = this.manager.files.some((file: { uploading?: boolean }) => file.uploading);
      if (this.uploading && !isUploading) {
        this.dispatchEvent(new CustomEvent('all-finished', { bubbles: false }));
      }
      this.uploading = isUploading;
    };

    this.manager.addEventListener('upload-success', checkAllFinished);
    this.manager.addEventListener('upload-error', checkAllFinished);
    this.manager.addEventListener('upload-abort', checkAllFinished);
  }
}

customElements.define('vaadin-upload-manager-connector', UploadManagerConnector);
