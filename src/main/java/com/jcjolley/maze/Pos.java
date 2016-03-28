/*
 * The MIT License
 *
 * Copyright 2015 josh.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.jcjolley.maze;

/**
 *
 * @author josh
 */
public final class Pos {

	private final int x;
	private final int y;

	private Pos(int x, int y) {
		this.x = x;
		this.y = y;
	}

	public static Pos create(int x, int y) {
		return new Pos(x,y);
	}

	public Pos goNorth() {
		return Pos.create(x, y + 1);
	}

	public Pos goEast() {
		return Pos.create(x + 1, y);
	}

	public Pos goSouth() {
		return Pos.create(x, y - 1);
	}

	public Pos goWest() {
		return Pos.create(x - 1, y);
	}

	public int getX() {
		return x;
	}

	public int getY() {
		return y;
	}

	public Pos go(Direction d) {
		switch (d) {
			case NORTH:
				return goNorth();
			case EAST:
				return goEast();
			case SOUTH:
				return goSouth();
			case WEST:
				return goWest();
			default:
				return null;
		}
	}

	public Pos goBack(Direction d) {
		switch (d) {
			case NORTH:
				return goSouth();
			case EAST:
				return goWest();
			case SOUTH:
				return goNorth();
			case WEST:
				return goEast();
			default:
				return null;
		}
	}

	public boolean inBounds(int size) {
		return x >= 0 && x < size && y >= 0 && y < size;
	}

	@Override
	public int hashCode() {
		int hash = 5;
		hash = 37 * hash + this.x;
		hash = 37 * hash + this.y;
		return hash;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		final Pos other = (Pos) obj;
		if (this.x != other.x) {
			return false;
		}
		return this.y == other.y;
	}

}
