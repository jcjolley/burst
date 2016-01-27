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
public class Node {

	private final boolean entrance;
	private boolean exit;
	private final Pos pos;
	private int size;
	private Node north;
	private Node east;
	private Node south;
	private Node west;
	private Node back;
	

	private Node(Builder builder) {
		entrance = builder.entrance;
		exit = builder.exit;
		north = builder.north;
		east = builder.east;
		south = builder.south;
		west = builder.west;
		back = builder.back;
		pos = builder.pos;
		size = builder.size;
	}

	public static Node create(Node n){
		return new Builder(n.getPos())
			.north(n.getNorth())
			.east(n.getEast())
			.west(n.getWest())
			.south(n.getSouth())
			.back(n.getBack())
			.build();
	}
	
	public static class Builder implements GenericBuilder<Node> {

		private Pos pos;
		private boolean entrance = false;
		private boolean exit = false;
		private Node north = null;
		private Node east = null;
		private Node south = null;
		private Node west = null;
		private Node back = null;
		private int size = 1;

		public Builder(Pos pos) {
			this.pos = pos;
		}

		public Builder north(Node north) {
			if (north != null && north.getSouth() != null) {
				throw new IllegalArgumentException("Tried to set north when argument node is already connected to its south.");
			}

			if (north == null) {
				throw new IllegalArgumentException("Cannot set direction to null");
			}
			this.north = north;
			return this;
		}

		public Builder east(Node east) {
			if (east != null && east.getWest() != null) {
				throw new IllegalArgumentException("Tried to set east when argument node is already connected to its east.");
			}

			if (east == null) {
				throw new IllegalArgumentException("Cannot set direction to null");
			}
			this.east = east;
			return this;
		}

		public Builder south(Node south) {
			if (south != null && south.getNorth() != null) {
				throw new IllegalArgumentException("Tried to set south when argument node is already connected to its north.");
			}
			if (south == null) {
				throw new IllegalArgumentException("Cannot set direction to null");
			}
			this.south = south;
			return this;
		}

		public Builder west(Node west) {
			if (west != null && west.getEast() != null) {
				throw new IllegalArgumentException("Tried to set west when argument node is already connected to its east.");
			}
			if (west == null) {
				throw new IllegalArgumentException("Cannot set direction to null");
			}
			this.west = west;
			return this;
		}
		
		public Builder back(Node back){
			this.back = back;
			return this;
		}
		
		public Builder exit() {
			this.exit = true;
			return this;
		}

		public Builder entrance() {
			this.entrance = true;
			return this;
		}
		
		public Builder size(int size){
			this.size = size;
			return this;
		}
		
		@Override
		public Node build() {
			return new Node(this);
		}
	}

	public boolean isEntrance() {
		return entrance;
	}

	public boolean isExit() {
		return exit;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public Node getNorth() {
		return north;
	}

	public void setNorth(Node north) {
		if (north != null && north.getSouth() != null) {
			throw new IllegalArgumentException("Tried to set north when argument node is already connected to its south.");
		}

		if (north == null) {
			throw new IllegalArgumentException("Cannot set direction to null");
		}

		this.north = north;
		north.south = this;
		north.back = this;
	}

	public Node getEast() {
		return east;
	}

	public void setEast(Node east) {
		if (east != null && east.getWest() != null) {
			throw new IllegalArgumentException("Tried to set east when argument node is already connected to its east.");
		}

		if (east == null) {
			throw new IllegalArgumentException("Cannot set direction to null");
		}

		this.east = east;
		east.west = this;
		east.back = this;
	}

	public Node getSouth() {
		return south;
	}

	public void setSouth(Node south) {
		if (south != null && south.getNorth() != null) {
			throw new IllegalArgumentException("Tried to set south when argument node is already connected to its north.");
		}

		if (south == null) {
			throw new IllegalArgumentException("Cannot set direction to null");
		}
		this.south = south;
		south.north = this;
		south.back = this;
	}

	public Node getWest() {
		return west;
	}

	public void setWest(Node west) {
		if (west != null && west.getEast() != null) {
			throw new IllegalArgumentException("Tried to set west when argument node is already connected to its east.");
		}
		if (west == null) {
			throw new IllegalArgumentException("Cannot set direction to null");
		}
		this.west = west;
		west.east = this;
		west.back = this;
	}

	public void setExit(boolean exit) {
		this.exit = exit;
	}

	public void setDirection(Direction d, Node n) {
		switch (d) {
			case NORTH:
				setNorth(n);
				break;
			case EAST:
				setEast(n);
				break;
			case SOUTH:
				setSouth(n);
				break;
			case WEST:
				setWest(n);
				break;
		}
	}

	public Node getDirection(Direction d){
		switch(d){
			case NORTH:
				return getNorth();
			case EAST:
				return getEast();
			case SOUTH:
				return getSouth();
			case WEST:
				return getWest();
			default:
				return null;
		}
	}

	public Pos getPos() {
		return pos;
	}

	public Node getBack() {
		return back;
	}

	public void setBack(Node back) {
		this.back = back;
	}
	

	@Override
	public String toString(){
		if (entrance)
			return "&#9635;";
		if (exit)
			return "&#9635;";
		return "&#x25a1;";
	}
}
