
/**
 * Decide wether to show the open or locked state
 */
export class unlockableValueConverter {
  toView(val, locked) {
    if (val) {
      return locked;
    } else {
      return false;
    }
  }
}
