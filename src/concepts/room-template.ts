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
   * If a template with the same dormName and roomType already exists, returns the existing template ID.
   * Corresponds to the `addTemplate` action.
   */
  async addTemplate(args: { dormName: string; roomType: string }): Promise<{
    templateID: string;
    dormName: string;
    roomType: string;
  }> {
    const { dormName, roomType } = args;

    // Check if template already exists
    const existing = await this.templates.findOne({ dormName, roomType });

    if (existing) {
      // Return existing template
      return {
        templateID: existing._id.toHexString(),
        dormName: existing.dormName,
        roomType: existing.roomType,
      };
    }

    // Create new template
    const template: Omit<RoomTemplate, "_id"> = { dormName, roomType };
    const result = await this.templates.insertOne(template as RoomTemplate);

    // Return the new template
    return {
      templateID: result.insertedId.toHexString(),
      dormName,
      roomType,
    };
  }

  /**
   * Retrieves a single template by its ID.
   * Corresponds to the `getTemplate` action.
   */
  async getTemplate(args: { templateID: string }): Promise<
    {
      _id: string;
      dormName: string;
      roomType: string;
    } | null
  > {
    const { templateID } = args;
    if (!ObjectId.isValid(templateID)) {
      return null;
    }
    const template = await this.templates.findOne({
      _id: new ObjectId(templateID),
    });

    if (!template) return null;

    // Serialize ObjectId to string for JSON response
    return {
      _id: template._id.toHexString(),
      dormName: template.dormName,
      roomType: template.roomType,
    };
  }

  /**
   * Finds templates based on optional filters for dorm name and room type.
   * Corresponds to the `findTemplates` action.
   */
  async findTemplates(
    params?: { dormName?: string; roomType?: string },
  ): Promise<
    Array<{
      _id: string;
      dormName: string;
      roomType: string;
    }>
  > {
    const { dormName, roomType } = params || {}; // Get values from the object, handle undefined
    const filter: Partial<RoomTemplate> = {};
    if (dormName) {
      filter.dormName = dormName;
    }
    if (roomType) {
      filter.roomType = roomType;
    }
    const templates = await this.templates.find(filter).toArray();

    // Serialize ObjectIds to strings for JSON response
    return templates.map((template) => ({
      _id: template._id.toHexString(),
      dormName: template.dormName,
      roomType: template.roomType,
    }));
  }

  /**
   * Updates an existing room template.
   * Corresponds to the `updateTemplate` action.
   */
  async updateTemplate(args: {
    templateID: string;
    dormName?: string;
    roomType?: string;
  }): Promise<boolean> {
    const { templateID, dormName, roomType } = args;

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
  async deleteTemplate(args: { templateID: string }): Promise<boolean> {
    const { templateID } = args;

    if (!ObjectId.isValid(templateID)) {
      return false;
    }

    const result = await this.templates.deleteOne({
      _id: new ObjectId(templateID),
    });

    return result.deletedCount === 1;
  }
}

export default RoomTemplateConcept;
