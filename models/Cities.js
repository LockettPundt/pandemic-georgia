const db = require("./con");

class City {
  constructor(name, id, infectedCounter, connectedCities) {
    this.name = name;
    this.id = id;
    this.infectedCounter = infectedCounter;
    this.connectedCities = connectedCities;
  }

  async postInfect(city, teamID) {
    //updates database with new infected total.
    try {
      const value = await this.getInfect(city.name, teamID);
      const bit = value[Object.keys(value)[0]] + 1;
      if (bit > 3) {
        return false;
      }
      const post = await db.one(
        `UPDATE game SET ${city.name}infect = $1 WHERE game.id = ${teamID} RETURNING game.${city.name}infect;`,
        [bit]
      );
      return post;
    } catch (e) {
      return e;
    }
  }

  static async getGame(teamID) {
    try {
      const response = await db.one(`SELECT * FROM game WHERE id = ${teamID};`);
      return response;
    } catch (e) {
      return e;
    }
  }

  async getInfect(city, teamID) {
    // getter from database for infected total.
    try {
      const response = await db.one(
        `SELECT game.${city}infect FROM game WHERE game.id = ${teamID};`
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  async removeInfect(city, teamID) {
    try {
      const value = await this.getInfect(city, teamID);
      const bit = value[Object.keys(value)[0]] - 1;
      const post = await db.one(
        `UPDATE game SET ${city}infect = $1 FROM teams WHERE game.id = ${teamID};`,
        [bit]
      );
      return post;
    } catch (e) {
      return e;
    }
  }

  static async scoreExists(teamID) {
    try {
      const response = await db.one(`SELECT EXISTS(SELECT id FROM score WHERE id=${teamID});`);
      return response;
    } catch (e) {
      return e;
    }
  }

  static async createScore(teamID) {
    try {
      const response = await db.one(`INSERT INTO score(id, win, loss) VALUES ($1, $2, $3) RETURNING id;`, [teamID, 0, 0]);
      return response;
    } catch (error) {
      return error;
    }
  }

  static async initCity(teamID, playerArray) {
    const response = await db.one(
      `INSERT INTO game(id, daltoninfect, blairsvilleinfect, atlantainfect, athensinfect, augustainfect, columbusinfect, maconinfect, savannahinfect, albanyinfect, valdostainfect, player1city, player2city, player3city, player4city, infectrate, playeractions, outbreak, playerturn, actions, history, cure_countdown, death_countdown) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING id`,

      [
        teamID,
        0,
        0,
        2,
        0,
        2,
        0,
        1,
        0,
        1,
        0,
        playerArray[0],
        playerArray[1],
        playerArray[2],
        playerArray[3],
        2,
        4,
        0,
        1,
        4,
        "",
        0,
        19
      ]
    );
    return response;
  }



  static async deleteGame(teamID) {
    try {
      const response = await db.one(`DELETE FROM game WHERE id = ${teamID};`);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


  static async gameExists(teamID) {
    try {
      const response = await db.one(
        `SELECT EXISTS(SELECT id FROM game WHERE id=${teamID});`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  static async getAllCityInfections(teamID) {
    try {
      const response = await db.one(
        `SELECT  game.daltoninfect, 
        game.blairsvilleinfect, 
        game.atlantainfect, 
        game.athensinfect, 
        game.augustainfect, 
        game.columbusinfect, 
        game.maconinfect, 
        game.savannahinfect, 
        game.albanyinfect, 
        game.valdostainfect FROM game WHERE id=${teamID};`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async postAllCityInfections(teamID, cityArray) {
    try {
      const response = await db.one(
        `UPDATE game SET daltoninfect = ${cityArray[0]}, 
        blairsvilleinfect = ${cityArray[1]}, 
        atlantainfect = ${cityArray[2]}, 
        athensinfect = ${cityArray[3]}, 
        augustainfect = ${cityArray[4]}, 
        columbusinfect = ${cityArray[5]}, 
        maconinfect = ${cityArray[6]}, 
        savannahinfect = ${cityArray[7]}, 
        albanyinfect = ${cityArray[8]}, 
        valdostainfect = ${cityArray[9]}
        WHERE id=${teamID} RETURNING id;`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = City;