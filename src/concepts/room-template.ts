import { Collection, Db, ObjectId } from "npm:mongodb";

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
   * Corresponds to the `addTemplate` action.
   */
  async addTemplate(dormName: string, roomType: string): Promise<string> {
    const template: Omit<RoomTemplate, "_id"> = { dormName, roomType };
    const result = await this.templates.insertOne(template as RoomTemplate);

    // Return the string ID of the new template
    return result.insertedId.toHexString();
  }

  /**
   * Retrieves a single template by its ID.
   * Corresponds to the `getTemplate` action.
   */
  async getTemplate(templateID: string): Promise<RoomTemplate | null> {
    if (!ObjectId.isValid(templateID)) {
      return null;
    }
    return await this.templates.findOne({ _id: new ObjectId(templateID) });
  }

  /**
   * Finds templates based on optional filters for dorm name and room type.
   * CorDresponds to the `findTemplates` action.
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

  /**
   * Updates an existing room template.
   * Corresponds to the `updateTemplate` action.
   */
  async updateTemplate(
    templateID: string,
    dormName?: string,
    roomType?: string,
  ): Promise<boolean> {
    if (!ObjectId.isValid(templateID)) {
      return false;
    }

    // Build an update object with only the fields that were provided
    const updateFields: Partial<Omit<RoomTemplate, "_id">> = {};
    if (dormName) {
      updateFields.dormName = dormName;
    }
    if (roomType) {
      updateFields.roomType = roomType;
    }

    // If no fields to update, return true (as no-op is successful)
    if (Object.keys(updateFields).length === 0) {
      return true;
    }

    const result = await this.templates.updateOne(
      { _id: new ObjectId(templateID) },
      { $set: updateFields },
    );

    return result.modifiedCount === 1;
  }

  /**
   * Deletes a room template from the catalog.
   * Corresponds to the `deleteTemplate` action.
   */
  async deleteTemplate(templateID: string): Promise<boolean> {
    if (!ObjectId.isValid(templateID)) {
      return false;
    }

    const result = await this.templates.deleteOne({
      _id: new ObjectId(templateID),
    });

    return result.deletedCount === 1;
  }
}
