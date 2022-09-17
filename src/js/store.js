export default class Store {
  oldFiles = [];
  doneFiles = [];

  delteOldFile(id) {
    if (this.oldFiles.length == 1) {
      this.oldFiles = [];
    }
    this.oldFiles = this.oldFiles.filter(oldId => oldId != id);
  }

  delteDoneFile(id) {
    if (this.doneFiles.length <= 1) {
      this.doneFiles = [];
    } else {
      this.doneFiles = this.doneFiles.filter(doneFile => doneFile.id != id);
    }
  }
}
