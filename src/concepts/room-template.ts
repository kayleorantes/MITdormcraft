import { Collection, Db, ObjectId } from "mongodb";

// --- Type Definitions ---
export interface RoomTemplate {
  _id: ObjectId;
  dormName: string;
  roomType: string;
}

export class RoomTemplateConcept {
  private readonly templates: Collection<RoomTemplate>;

  constructor(db: Db) {
    this.templates = db.collection<RoomTemplate>("room_templates");
  }

  /**
   * Adds a new room template to the catalog.
   */
  async addTemplate(dormName: string, roomType: string): Promise<RoomTemplate> {
    const template: Omit<RoomTemplate, "_id"> = { dormName, roomType };
    const result = await this.templates.insertOne(template as RoomTemplate);
    return { _id: result.insertedId, ...template };
  }

  /**
   * Retrieves a single template by its ID.
   */
  async getTemplate(templateID: string): Promise<RoomTemplate | null> {
    if (!ObjectId.isValid(templateID)) {
      return null;
    }
    return await this.templates.findOne({ _id: new ObjectId(templateID) });
  }

  /**
   * Finds templates based on optional filters for dorm name and room type.
   */
  async findTemplates(
    dormName?: string,
    roomType?: string,
  ): Promise<RoomTemplate[]> {
    const filter: Partial<RoomTemplate> = {};
    if (dormName) {
      filter.dormName = dormName;
    }
    if (roomType) {
      filter.roomType = roomType;
    }
    return await this.templates.find(filter).toArray();
  }
}
