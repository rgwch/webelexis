/*******************************************************************************
 * Copyright (c) 2005-2011, G. Weirich and Elexis
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * <p>
 * Contributors:
 * G. Weirich - initial implementation
 *******************************************************************************/

package ch.rgw.tools;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Eine VersionedResource ist ein Datenobjekt, das einen String-Inhalt so
 * speichert, dass bei einer neuen Speicherung der alte Inhalt nicht
 * überschrieben, sondern mit Zeitstempel aufbewahrt wird. Zu einem späteren
 * Zeitpunkt kann jede frühere Version wiederhergestellt werden. Die innere
 * Implementation des Versionsalgorithmus ist transparent. Es ist sowohl eine
 * simpke speicherung aller Versionen, als auch eine Speicherung eines Diff
 * möglich. Abgeleitete Klassen könnten auch die alten Versionen extern ablegen
 * etc. Zur Rückwärtskompatibiltät kann VersionedResource auch mit
 * CompEx-gepackten Strings umgehen: Diese werden beim ersten Einlesen in
 * VersionedResourcen umgewandelt.
 *
 * @author Gerry
 */
public class VersionedResource {
  ArrayList<ResourceItem> items;

  @SuppressWarnings("unchecked")
  private VersionedResource(byte[] in) throws Exception {
    if ((in == null) || (in.length == 0)) {
      items = new ArrayList<>();
    } else {
      ByteArrayInputStream bais = new ByteArrayInputStream(in);
      ObjectInputStream ois = new ObjectInputStream(bais);
      items = (ArrayList<ResourceItem>) ois.readObject();
    }
  }

  /**
   * Die Factory und einzige Möglichkeit, eine VersionedResource zu erstellen
   *
   * @param src mit serialize() erstellte frühere Repräsentation dieses Objekts,
   *            oder null, um eine neue VersionedResource zu erstellen.
   * @return die VersionedResource.
   */
  public static VersionedResource load(byte[] src) throws Exception {
    byte[] exp = CompEx.expand(src);
    return new VersionedResource(exp);
  }

  /**
   * Eine neue Version des Dateninhalts einsetzen
   *
   * @param newValue der neue String
   * @param remark   Ein kurzer Beschreibungstext für diese Version
   * @return false, wenn kein updatze erfolgte (z.B. weil die neue Version
   * identisch mit der vorherigen war)
   */
  public boolean update(String newValue, String remark) {
    if ((!items.isEmpty()) && getHead().equals(newValue)) {
      return false;
    }
    return items.add(new ResourceItem(ResourceItem.REPLACE, newValue, remark));
  }

  /**
   * Die neueste Version des Dateninhalts auslesen
   */
  public String getHead() {
    if (items.isEmpty()) {
      return null;
    }
    return items.get(items.size() - 1).data;
  }

  /**
   * Versionsnummer der neuesten Version auslesen
   */
  public int getHeadVersion() {
    return items.size() - 1;
  }

  /**
   * Eine bestimmte Version des Dateninhalts auslesen
   *
   * @param v die gewünschte Versionsnummer
   * @return der Dateninhalt in der gewünschten Version oder Null, wenn die
   * gewünschte Version nicht existiert. Der zurückgelieferte Text
   * enthält einen einzeiligen Header, der die Versionsmummer,
   * Zeit/Datum der Erstellung und den Anmerkungstext enthält.
   */
  public ResourceItem getVersion(int v) {
    if (v < 0 || v >= items.size()) {
      return null;
    }
    return items.get(v);
  }

  /**
   * Eine kompaktes Speicherbares Abbild dieser VersionedResource erstellen.
   * Dieses enthält alle Versionen in komprimierter Form.
   */
  public byte[] serialize() throws Exception {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(baos);
    oos.writeObject(items);
    return CompEx.Compress(baos.toByteArray(), CompEx.ZIP);
  }

  /**
   * Alle Einträge ausser dem Neuesten entfernen
   */
  public void purge() {
    if (items.size() > 0) {
      ResourceItem head = items.get(items.size() - 1);
      items.clear();
      items.add(head);
    }
  }

  public static class ResourceItem implements Serializable {
    private static final long serialVersionUID = -7214215925169803335L;
    static final int REPLACE = 0;
    static final int DIFF1 = 1;
    final int mode;
    public final long timestamp;
    public final String remark;
    public final String data;

    ResourceItem(int mode, String data, String remark) {
      this.mode = mode;
      this.data = data;
      this.remark = remark;
      timestamp = System.currentTimeMillis();
    }

    public String getLabel() {
      SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy HH:mm");
      Date date = new Date();
      return df.format(date) + " - " + remark;
    }
  }

}
